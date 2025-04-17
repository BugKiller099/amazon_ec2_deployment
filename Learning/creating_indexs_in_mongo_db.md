# Index Creation in MongoDB

## What is Index Creation?
Index creation in MongoDB is the process of setting up **indexes** on a collection to **improve query performance**. An index acts like a **table of contents** in a book, helping the database find documents quickly instead of scanning every document.

---

## Why Use Indexes?
Indexes speed up data retrieval by allowing MongoDB to locate data efficiently. Without indexes, MongoDB **scans every document** in a collection (a **full collection scan**), which is slow for large datasets.

---

## Types of Indexes
MongoDB provides different types of indexes, such as:
1. **Single Field Index** - Indexes on a single field (e.g., `emailId`).
2. **Compound Index** - Indexes on multiple fields.
3. **Unique Index** - Ensures uniqueness of values.
4. **Text Index** - Used for full-text search.
5. **Geospatial Index** - Used for location-based queries.

---

## Index Creation in Code
```javascript
userSchema.index({ emailId: 1 }, { unique: true });
```
This **creates an index** on the `emailId` field:
- `{ emailId: 1 }` → Sorts in **ascending order**.
- `{ unique: true }` → Ensures that no two users have the same email.

---

## Ensuring Index Sync
```javascript
(async () => {
    try {
        await User.syncIndexes();
        console.log("Indexes synced successfully.");
    } catch (error) {
        console.error("Error syncing indexes:", error);
    }
})();
```
- **`User.syncIndexes()`** forces MongoDB to apply and update indexes in case of schema changes.
- This helps **avoid duplicate entries** and **optimize queries**.

---

## How Indexes Improve Performance
### Without Index
```javascript
const user = await User.findOne({ emailId: "abc@example.com" });
```
- **MongoDB scans every document** to find a match → **Slow** for large datasets.

### With Index
- MongoDB uses the **index** to jump directly to the matching document → **Fast**.

---

## Checking Indexes in MongoDB
To check the indexes created for a collection, run:
```bash
db.users.getIndexes()
```

---

## When to Use Indexes?
✅ When querying large datasets frequently  
✅ When searching based on unique fields like `emailId`  
✅ When performing sorting (`.sort()`) or filtering (`.find()`)  

Would you like me to explain more about **compound indexes** or **performance trade-offs**? 🚀

