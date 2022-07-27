# mongoose-hydrate-populated-data

State: model has relation with collection1 and collection2, like:
```ts
import { model, Schema } from 'mongoose'

const mySchema: Schema<MyDocument> = new Schema({
  fieldName1: {
    type: Schema.Types.ObjectId,
    ref: collection1,
    required: false,
    index: true
  },
  fieldName2: {
    type: Schema.Types.ObjectId,
    ref: collection2,
    required: true,
    index: true
  },
})
```
- Use `populatingLookupPreserveNullQuery` for collection1,
  - because model may have null in collection1 reference due to `required: false`.

- Use `populatingLookupQuery` for collection2,
  - because model cannot have null in collection2 reference due to `required: true`.

```ts
import { FilterQuery } from 'mongoose'
import { populatingLookupPreserveNullQuery, populatingLookupQuery } from '.'

const records = await model.aggregate([
  {
    $match: FilterQuery<any>
  },
  ...populatingLookupPreserveNullQuery(collection1, fieldName1),
  ...populatingLookupQuery(collection2, fieldName2),
])

records.map((record) => hydratePopulated(model, record, [fieldName1, fieldName2]))
```

https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/#document-operand-with-options
