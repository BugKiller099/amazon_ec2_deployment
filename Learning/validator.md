Here’s a **markup for feature reference** that explains the validations and features of the `userSchema` in a clear and organized way. This can be used as documentation or a reference guide for developers working with the schema.

---

## **User Schema Feature Reference**

### **Overview**
The `userSchema` defines the structure and validation rules for user documents in the database. It ensures data integrity, enforces security, and provides default values where necessary.

---

### **Fields and Validations**

| **Field**     | **Type**       | **Validation Rules**                                                                 | **Description**                                                                 |
|---------------|----------------|-------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **firstName** | `String`       | - Required<br>- `minLength: 4`<br>- `maxLength: 30`<br>- `trim: true`               | User's first name. Must be between 4 and 30 characters.                         |
| **lastName**  | `String`       | - Optional<br>- `maxLength: 30`<br>- `trim: true`                                   | User's last name. Must not exceed 30 characters.                                |
| **emailId**   | `String`       | - Required<br>- `unique: true`<br>- `trim: true`<br>- `lowercase: true`<br>- Validated using `validator.isEmail()` | User's email address. Must be unique and in a valid email format.               |
| **password**  | `String`       | - Required<br>- `minLength: 8`<br>- Validated using `validator.isStrongPassword()`   | User's password. Must be at least 8 characters long and include:<br>- 1 uppercase letter<br>- 1 lowercase letter<br>- 1 number<br>- 1 special character. |
| **age**       | `Number`       | - Optional<br>- `min: 13`<br>- `max: 120`                                           | User's age. Must be between 13 and 120.                                         |
| **gender**    | `String`       | - Optional<br>- `trim: true`<br>- Must be one of: `male`, `female`, `None`          | User's gender. Only accepts specific values.                                    |
| **photoUrl**  | `String`       | - Optional<br>- Default: `"https://geo.com"`<br>- Validated using `validator.isURL()` | URL of the user's profile photo. Must be a valid URL.                           |
| **skills**    | `[String]`     | - Optional<br>- Array must not be empty<br>- Each skill must be at least 2 characters long | List of user's skills.                                                         |

---

### **Default Features**
- **Timestamps**: Automatically adds `createdAt` and `updatedAt` fields to track document creation and modification times.
- **Trim**: Removes extra spaces from the beginning and end of string fields (`firstName`, `lastName`, `emailId`, `gender`).

---

### **Validation Details**

#### **1. Email Validation**
- Uses `validator.isEmail()` to ensure the email is in a valid format.
- Example:
  ```javascript
  validator.isEmail("test@example.com"); // true
  validator.isEmail("invalid-email");   // false
  ```

#### **2. Password Validation**
- Uses `validator.isStrongPassword()` to enforce strong password rules.
- Example:
  ```javascript
  validator.isStrongPassword("Password123!", {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }); // true
  ```

#### **3. URL Validation**
- Uses `validator.isURL()` to ensure the photo URL is valid.
- Example:
  ```javascript
  validator.isURL("https://example.com"); // true
  validator.isURL("invalid-url");        // false
  ```

#### **4. Gender Validation**
- Ensures the gender value is one of the allowed options: `male`, `female`, or `None`.
- Example:
  ```javascript
  ["male", "female", "None"].includes("male"); // true
  ["male", "female", "None"].includes("other"); // false
  ```

#### **5. Skills Validation**
- Ensures the skills array is not empty and each skill is at least 2 characters long.
- Example:
  ```javascript
  skills.every(skill => skill.trim().length >= 2); // true if all skills are valid
  ```

---

### **Example Document**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john.doe@example.com",
  "password": "Password123!",
  "age": 25,
  "gender": "male",
  "photoUrl": "https://example.com/profile.jpg",
  "skills": ["JavaScript", "Node.js", "React"],
  "createdAt": "2023-10-01T12:00:00.000Z",
  "updatedAt": "2023-10-01T12:00:00.000Z"
}
```

---

### **Error Messages**
- **Invalid Email**: `"<email> is not a valid email address."`
- **Weak Password**: `"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."`
- **Invalid Gender**: `"<gender> is not a valid gender option."`
- **Invalid URL**: `"<url> is not a valid URL."`
- **Empty Skills Array**: `"Skills array cannot be empty, and each skill must be at least 2 characters long."`

---

### **Dependencies**
- **`validator`**: Used for email, password, and URL validation.
  ```bash
  npm install validator
  ```

---

This markup provides a comprehensive reference for the `userSchema`, making it easy for developers to understand and work with the schema. Let me know if you need further enhancements! 🚀