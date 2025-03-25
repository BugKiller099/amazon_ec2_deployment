# Mongoose Pre-Hook (Middleware) Guide

## 🚀 Introduction
Mongoose **pre-hooks** (middleware) allow you to execute logic **before** saving, updating, or deleting documents. They are useful for **validations, transformations, or side effects** before persisting data.

---
## 📌 Basic Syntax
```js
schema.pre("event", function (next) {
    // Middleware logic
    next();
});
```
- `event` can be `save`, `updateOne`, `findOne`, etc.
- Use `next()` to continue execution.
- Use `next(new Error("message"))` for validation failures.

---
## ✅ Example: Prevent Self-Connection Requests
```js
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["ignored", "interested", "accepted", "rejected"],
    },
}, { timestamps: true });

connectionRequestSchema.pre("save", function (next) {
    // Check if the sender and receiver are the same
    if (this.fromUserId.equals(this.toUserId)) {
        return next(new Error("Cannot send connection request to yourself!"));
    }
    next();
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;
```
### 🔹 Key Fixes in This Code:
✅ Uses `return next(new Error(...))` instead of `throw new Error(...)`.
✅ Ensures ObjectId comparison using `.equals()`.
✅ Calls `next()` only once.

---
## 🛑 Common Errors & Fixes

### ❌ Issue: `this` is Undefined in Arrow Functions
**Wrong:**
```js
schema.pre("save", async () => {
    console.log(this); // ❌ `this` is undefined
    next();
});
```
**Fix:** Use regular function (`function ()`) instead.
```js
schema.pre("save", async function (next) {
    console.log(this); // ✅ Works correctly
    next();
});
```

### ❌ Issue: Forgetting `next()`
**Wrong:** Missing `next()` causes execution to hang.
```js
schema.pre("save", async function () {
    console.log("Saving..."); // ❌ Missing next()
});
```
**Fix:** Always call `next()`.
```js
schema.pre("save", async function (next) {
    console.log("Saving...");
    next();
});
```

### ❌ Issue: Calling `next()` After `throw new Error()`
**Wrong:**
```js
schema.pre("save", function (next) {
    if (someCondition) {
        throw new Error("Invalid data"); // ❌ Causes unhandled rejection
    }
    next();
});
```
**Fix:** Use `return next(new Error(...))`.
```js
schema.pre("save", function (next) {
    if (someCondition) {
        return next(new Error("Invalid data"));
    }
    next();
});
```

---
## 🎯 Conclusion
- Use `pre("save")` for validation before saving.
- **Always** call `next()` or `next(new Error(...))`.
- **Do not use arrow functions (`() => {}`)** in pre-hooks.
- Ensure **valid `ObjectId`** before using `.equals()`.

🔹 Following these practices ensures **reliable, bug-free Mongoose pre-hooks**! 🚀

