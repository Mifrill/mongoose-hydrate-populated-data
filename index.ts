import mongoose from 'mongoose'

export const populatingLookupPreserveNullQuery = (
  collectionName: string,
  fieldName: string,
  foreignFieldName = '_id'
): mongoose.PipelineStage[] => {
  return [
    {
      $lookup: {
        from: collectionName,
        let: { [fieldName]: `$${fieldName}` },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: [`$${foreignFieldName}`, `$$${fieldName}`]
              }
            }
          }
        ],
        as: fieldName
      }
    },
    { $unwind: { path: `$${fieldName}`, preserveNullAndEmptyArrays: true } }
  ]
}

export const populatingLookupQuery = (
  collectionName: string,
  fieldName: string,
  foreignFieldName = '_id'
): mongoose.PipelineStage[] => {
  return [
    {
      $lookup: {
        from: collectionName,
        localField: fieldName,
        foreignField: foreignFieldName,
        as: fieldName
      }
    },
    { $unwind: { path: `$${fieldName}` } }
  ]
}

// https://github.com/Automattic/mongoose/issues/4727#issuecomment-349381917
export const hydratePopulated = (
  model: mongoose.Model<any>,
  json: Record<string, any>,
  populated: string[]
): mongoose.Document => {
  const document = model.hydrate(json)
  for (const path of populated) {
    if (!json[path]) { continue }
    const options = model.schema.paths[path]?.options
    if (!options?.ref) { continue }
    document[path] = mongoose.model(options.ref).hydrate(json[path])
  }
  return document
}
