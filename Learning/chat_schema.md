

# DevTinder Chat Application Backend

This repository contains the backend for a chat feature in a project called DevTinder. It uses MongoDB and Mongoose to store user data and chat messages. The application allows users to send and receive messages, with support for real-time messaging.

## Features

- **User Authentication**: Secure user login and JWT-based authentication.
- **Chat Management**: Creation of new chat conversations between users, storing messages, and tracking participants.
- **Real-time Messaging**: Using Socket.io for real-time message delivery and updates.
- **Populating User Data**: User data like `firstName`, `lastName`, and `photoUrl` are populated into chat messages.

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (either locally or using MongoDB Atlas)
- [Postman](https://www.postman.com/) (for testing APIs)
- [Socket.io](https://socket.io/) for real-time communication

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/devtinder-chat-backend.git
cd devtinder-chat-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project and add the following:

```plaintext
MONGODB_URI=mongodb://localhost:27017/devtinder
JWT_SECRET=your-secret-key
PORT=5000
```

- Replace `MONGODB_URI` with your MongoDB URI. If you're using MongoDB Atlas, get the connection string from your Atlas dashboard.
- Replace `JWT_SECRET` with a secure string for JWT token generation.

### 4. Run the server

```bash
npm start
```

The server will be running on `http://localhost:5000`.

## API Endpoints

### 1. **POST /auth/login**

- **Description**: Logs a user in and returns a JWT token.
- **Body**:
  ```json
  {
    "emailId": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt-token-here"
  }
  ```

### 2. **GET /chat/:targetUserId**

- **Description**: Retrieves a chat between the authenticated user and the target user, creating a new chat if none exists.
- **Authentication**: Requires a valid JWT token (pass it in the `Authorization` header or as a cookie).
- **Response**:
  ```json
  {
    "_id": "chat-id",
    "participants": [
      "userId1",
      "userId2"
    ],
    "messages": [
      {
        "senderId": "userId1",
        "text": "Hello",
        "seen": false,
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      },
      {
        "senderId": "userId2",
        "text": "Hi, how are you?",
        "seen": false,
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```

### 3. **POST /chat/message**

- **Description**: Sends a message in the chat between the authenticated user and the target user.
- **Body**:
  ```json
  {
    "targetUserId": "userId2",
    "text": "Hey! How's it going?"
  }
  ```
- **Response**:
  ```json
  {
    "message": {
      "senderId": "userId1",
      "text": "Hey! How's it going?",
      "seen": false,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  }
  ```

### 4. **POST /socket/message**

- **Description**: Sends a real-time message via Socket.io to the chat participants.
- **Authentication**: Requires a valid JWT token for real-time communication.

## Database Schema

### User

- **_id**: ObjectId
- **firstName**: String
- **lastName**: String
- **emailId**: String
- **password**: String (hashed)
- **photoUrl**: String (URL to user photo)

### Chat

- **_id**: ObjectId
- **participants**: Array of ObjectIds (referencing `User` documents)
- **messages**: Array of `Message` objects

### Message

- **senderId**: ObjectId (referencing `User`)
- **text**: String (message content)
- **seen**: Boolean (whether the message has been seen)
- **seenAt**: Date (time when the message was seen)
- **createdAt**: Date (message creation time)
- **updatedAt**: Date (message update time)

## Real-time Communication (Socket.io)

- This backend supports real-time communication between users using [Socket.io](https://socket.io/). Once a message is sent, it is broadcasted to the other user in real-time.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to modify it according to the specific details of your project, such as how to run the application, any additional functionality, or changes in the API.