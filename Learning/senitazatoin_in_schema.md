# User Model with Mongoose

This project defines a **User Model** using Mongoose, ensuring proper validation, sanitization, password hashing, and index creation for optimized performance.

---

## 🚀 Features

- **Strict Validation**: Ensures correct input types and constraints.
- **Sanitization**: Trims strings, enforces lowercase emails, and validates URLs.
- **Password Security**: Hashes passwords before saving.
- **Automatic Timestamps**: Tracks `createdAt` and `updatedAt` for user records.
- **Indexing for Performance**: Ensures unique email constraints.
- **Pre-save Hooks**: Runs middleware before saving a user.

---

## 📦 Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Install required NPM packages:
   ```sh
   npm install mongoose validator bcrypt
   ```

---

## 🛠️ User Schema Definition

```javascript
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: { type: String, required: true, minLength: 4, trim: true },
    lastName: { type: String, trim: true },
    emailId: {
        type: String, required: true, unique: true, trim: true, lowercase: true,
        validate: [validator.isEmail, "Invalid email format."]
    },
    password: { type: String, required: true, select: false },
    age: { type: Number, min: 0, max: 150 },
    gender: { type: String, enum: ['male', 'female', 'None'], default: 'None' },
    photoUrl: { type: String, default: "https://geo.com", validate: [validator.isURL, "Invalid URL."] },
    skills: { type: [String], default: [] }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.index({ emailId: 1 }, { unique: true });

const User = model("User", userSchema);
module.exports = User;
```

---

## 🔧 API Endpoints

### 1️⃣ Create a New User
**Endpoint:** `POST /users`
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john@example.com",
  "password": "securepassword",
  "age": 25,
  "gender": "male",
  "photoUrl": "https://profile.com/john",
  "skills": ["JavaScript", "Node.js"]
}
```

### 2️⃣ Get User by ID
**Endpoint:** `GET /users/:id`

### 3️⃣ Update User
**Endpoint:** `PUT /users/:id`
```json
{
  "firstName": "Jane",
  "age": 30
}
```

### 4️⃣ Delete User
**Endpoint:** `DELETE /users/:id`

---

## ⚠️ Important Considerations
- Passwords are **hashed** before saving for security.
- Emails must be **unique** and **valid**.
- API responses handle errors effectively.

---

## 📜 License
This project is licensed under the MIT License.

