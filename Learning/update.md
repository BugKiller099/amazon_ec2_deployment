 # Update User API (PUT Method)

## Overview
This API endpoint allows updating an existing user's details using the HTTP PUT method.

## Endpoint
`PUT /user/:id`

## Request Parameters
- `id` (Path Parameter) - The unique identifier of the user to be updated.

## Allowed Fields for Update
Only the following fields can be updated:
```json
[
    "firstName",
    "lastName",
    "emailId",
    "password",
    "age",
    "gender",
    "photoUrl",
    "skills"
]
```

## Request Body
A valid request body should include only the allowed fields. Example:
```json
{
    "firstName": "John",
    "lastName": "Doe",
    "emailId": "johndoe@example.com",
    "password": "newpassword123",
    "age": 30,
    "gender": "male",
    "photoUrl": "https://example.com/profile.jpg",
    "skills": ["JavaScript", "Node.js"]
}
```

## Implementation Details
```javascript
const validator = require('validator');

app.put("/user/:id", async (req, res) => {
    try {
        const ALLOWED_UPDATED = [
            "firstName",
            "lastName",
            "emailId",
            "password",
            "age",
            "gender",
            "photoUrl",
            "skills",
        ];

        // Filter out unwanted fields
        const updates = Object.keys(req.body);
        const isValidUpdate = updates.every(field => ALLOWED_UPDATED.includes(field));

        if (!isValidUpdate) {
            return res.status(400).send("Invalid updates detected.");
        }

        // Validate email
        if (req.body.emailId && !validator.isEmail(req.body.emailId)) {
            return res.status(400).send("Invalid email format.");
        }

        // Hash password if being updated
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send(user);

    } catch (err) {
        res.status(400).send("Error updating user: " + err.message);
    }
});
```

## Explanation
1. **Allowed Fields Check**: The update request is filtered to ensure only allowed fields are modified.
2. **Email Validation**: The `validator` package is used to validate the email format.
3. **Password Hashing**: If the password field is updated, it is hashed before storing in the database.
4. **Database Update**: The user record is updated in MongoDB using `findByIdAndUpdate()`.
5. **Validation**: `runValidators: true` ensures that validation rules are applied even during updates.
6. **Error Handling**: Proper error handling ensures meaningful responses are returned for invalid requests or non-existent users.

## Response Examples
**Success Response:**
```json
{
    "_id": "64f8a0b5f2d2b10b3d6e9c1a",
    "firstName": "John",
    "lastName": "Doe",
    "emailId": "johndoe@example.com",
    "age": 30,
    "gender": "male",
    "photoUrl": "https://example.com/profile.jpg",
    "skills": ["JavaScript", "Node.js"],
    "createdAt": "2023-08-31T12:00:00.000Z",
    "updatedAt": "2023-09-01T15:30:00.000Z"
}
```

**Error Response (Invalid Fields):**
```json
{
    "error": "Invalid updates detected."
}
```

**Error Response (Invalid Email):**
```json
{
    "error": "Invalid email format."
}
```

**Error Response (User Not Found):**
```json
{
    "error": "User not found"
}
```

## Testing in Postman
1. Open Postman.
2. Select `PUT` method.
3. Enter the URL: `http://localhost:5000/user/{id}` (Replace `{id}` with a valid user ID).
4. Go to the `Body` tab and select `raw` and `JSON`.
5. Enter the request body as shown above.
6. Click `Send` and verify the response.

## Security Considerations
- Ensure password hashing to maintain user security.
- Validate email format before updating.
- Only allow valid fields to be updated to prevent unintended modifications.
- Implement authentication and authorization checks before modifying user data.

## Conclusion
This API provides a robust way to update user details with security measures such as password hashing, validation, and error handling. Properly structuring update operations helps maintain data integrity and prevent unwanted changes.

