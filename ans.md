# Express Application Setup and npm Versioning Guide

## 1. Create a Repository

- Create a directory for your project:

    ```bash
    mkdir my-express-app
    cd my-express-app
    ```

- Initialize a Git repository:

    ```bash
    git init
    ```

## 2. Initialize the Repository (npm init)

- Run the following command to initialize the project with `package.json`:

    ```bash
    npm init -y
    ```

- This creates a default `package.json` file.

## 3. Install Required Files

- The following files will be created automatically:
  - `node_modules/`: Contains installed packages.
  - `package.json`: Manages project metadata and dependencies.
  - `package-lock.json`: Locks dependencies to specific versions.

## 4. Install Express

- Install the Express library:

    ```bash
    npm install express
    ```

## 5. Create a Server

- Create a file named `server.js` and add the following code:

    ```javascript
    const express = require('express');
    const app = express();

    app.get('/test', (req, res) => {
        res.send('This is the /test route');
    });

    app.listen(9999, () => {
        console.log('Server is running on port 9999');
    });
    ```

- Run the server:

    ```bash
    node server.js
    ```

## 6. Install Nodemon and Update Scripts

- Install `nodemon` as a development dependency:

    ```bash
    npm install nodemon --save-dev
    ```

- Update the `scripts` section of your `package.json` file:

    ```json
    "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js"
    }
    ```

- Start the server in development mode using:

    ```bash
    npm run dev
    ```

## 7. Difference Between Caret (`^`) and Tilde (`~`) in Versioning

- **Caret (`^`)**:
  - Allows updates to the most recent *minor* and *patch* versions within the same *major* version.
  - Example: `^4.5.6` allows `4.5.6`, `4.6.0`, `4.7.0`, but not `5.0.0`.

- **Tilde (`~`)**:
  - Allows updates to the most recent *patch* version within the same *minor* version.
  - Example: `~4.5.6` allows `4.5.6`, `4.5.7`, `4.5.8`, but not `4.6.0`.

## 8. Use of `-g` When Installing npm Packages

- The `-g` flag stands for **global installation**.
- When a package is installed globally:
  - It can be used from any directory on your system.
  - Useful for command-line tools like `nodemon` or `npm`.
  
- Example:

    ```bash
    npm install -g nodemon
    ```

- After installation, you can use `nodemon` directly in your terminal:

    ```bash
    nodemon server.js
    ```

## Summary

- You now have an Express app that:
  - Serves a `/test` route.
  - Uses `nodemon` for auto-restarting the server in development.
  - Properly manages versioning with caret (`^`) and tilde (`~`).
