# Update User Endpoint

## Overview
This endpoint allows users to update specific fields of their profile using the HTTP `PATCH` method. It ensures only allowed fields are updated, validates input, and applies security measures like password hashing.

## Route
```
PATCH /user/:id
```

## Request Parameters
- `id` (Path Parameter) - The unique identifier of the user to be updated.

## Allowed Fields for Update
The following fields can be updated:
- `firstName`
- `lastName`
- `emailId`
- `password` (hashed before saving)
- `age`
- `gender` (validated: must be "male", "female", or "None")
- `photoUrl`
- `skills`

## Request Body Example
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john.doe@example.com",
  "password": "newpassword123",
  "age": 30,
  "gender": "male",
  "photoUrl": "https://example.com/profile.jpg",
  "skills": ["JavaScript", "Node.js"]
}
```

## Response
### Success Response (200 OK)
```json
{
  "_id": "60f8a2c9b5d3c100175aa6f5",
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john.doe@example.com",
  "age": 30,
  "gender": "male",
  "photoUrl": "https://example.com/profile.jpg",
  "skills": ["JavaScript", "Node.js"],
  "updatedAt": "2025-02-20T10:00:00.000Z"
}
```

### Error Responses
#### Invalid Fields (400 Bad Request)
```json
{
  "error": "Invalid updates detected."
}
```

#### User Not Found (404 Not Found)
```json
{
  "error": "User not found"
}
```

## Security Measures
- **Input Validation:** Ensures only allowed fields are updated.
- **Password Hashing:** If the password is changed, it is hashed before being saved.
- **Error Handling:** Prevents unexpected errors from breaking the application.

## Usage in Postman
1. Open Postman and select `PATCH` method.
2. Enter the URL: `http://localhost:PORT/user/:id` (replace `:id` with a valid user ID).
3. Go to `Body` > `raw` and select `JSON`.
4. Enter the request body with the fields you want to update.
5. Click `Send` to make the request.

## Notes
- This endpoint only updates the provided fields; it does not remove existing ones.
- Ensure `bcrypt` is installed for password hashing.

## Dependencies
- `express`
- `mongoose`
- `bcrypt`

