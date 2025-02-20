# Difference Between PUT and PATCH in REST APIs

## Overview
When designing RESTful APIs, choosing between `PUT` and `PATCH` for updating resources is important. Both are HTTP methods used for modifying data, but they have distinct differences.

## Key Differences

| Feature            | PUT (Update Entire Resource) | PATCH (Partial Update) |
|--------------------|--------------------------------|--------------------------|
| **Purpose**        | Replaces the entire resource with new data. | Updates only specified fields while keeping the rest unchanged. |
| **Request Body**   | Requires the full object (all fields must be provided). | Only the fields that need updating can be sent. |
| **Use Case**       | When you need to completely replace a resource. | When you want to modify specific fields without affecting others. |
| **Efficiency**     | Less efficient if only a small update is needed. | More efficient because it only changes the necessary fields. |

## Example Usage
### 1. Using PUT (Full Update)
```http
PUT /user/123
Content-Type: application/json

{
    "firstName": "John",
    "lastName": "Doe",
    "emailId": "john.doe@example.com",
    "password": "securePass123",
    "age": 30,
    "gender": "male",
    "photoUrl": "https://example.com/profile.jpg",
    "skills": ["JavaScript", "Node.js"]
}
```
📌 If a field is missing, it may be removed from the resource.

### 2. Using PATCH (Partial Update)
```http
PATCH /user/123
Content-Type: application/json

{
    "age": 31,
    "skills": ["JavaScript", "Node.js", "React"]
}
```
📌 Only updates `age` and `skills` without affecting other fields.

## Why PATCH is Used in Your API
Your API uses `PATCH` for updating users because:
- It allows partial updates, making it more efficient.
- Users may update only a few fields instead of sending the whole object.
- Password updates require hashing, which is handled correctly in `PATCH`.

## Conclusion
- Use `PUT` when you need to replace the entire resource.
- Use `PATCH` when you need to update only specific fields.
- Your API correctly implements `PATCH` for updating user details while enforcing validation and security measures.

🚀 Happy coding!

