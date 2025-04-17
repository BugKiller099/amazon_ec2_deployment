Here's the Markdown file for **Compound Index in Mongoose**:  

```md
# Compound Index in Mongoose  

A **compound index** in Mongoose allows indexing multiple fields together, improving query performance for searches that filter or sort based on those fields.

## Syntax  
```js
schema.index({ field1: 1, field2: -1 });
```
- `1` → **Ascending order**
- `-1` → **Descending order**

## Example  
```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number },
});

// Creating a compound index on lastName and firstName
userSchema.index({ lastName: 1, firstName: -1 });

const User = mongoose.model('User', userSchema);
```
In this example:
- The index is applied to `lastName` in **ascending** order (`1`).
- The index is applied to `firstName` in **descending** order (`-1`).
- Queries filtering by both fields will be optimized.

## Benefits of Compound Index  
✅ **Faster Queries**: Speeds up searches involving multiple fields.  
✅ **Efficient Sorting**: Allows sorting by indexed fields without additional computation.  
✅ **Better Query Execution Plan**: Helps MongoDB choose an optimized execution path.

## Example Query Usage  
### Optimized Query  
This query benefits from the **compound index**:  
```js
User.find({ lastName: "Doe" }).sort({ firstName: -1 });
```

### Non-Optimized Query  
If a query only filters by `firstName`, the index **won't be fully utilized**:  
```js
User.find({ firstName: "John" });
```

## Checking Existing Indexes  
To list all indexes in a collection:  
```js
User.collection.getIndexes((err, indexes) => {
    console.log(indexes);
});
```

## Conclusion  
Compound indexes are useful when searching, filtering, and sorting by **multiple fields**. Use them wisely to **improve query performance** without excessive storage overhead. 🚀
```

Let me know if you need modifications! 🚀