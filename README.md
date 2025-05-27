# CyberSafe 🛡️

I built CyberSafe as a secure web application designed to serve as a Student Cybersecurity Sharing Platform. It enables users — especially students — to register, log in, participate in forum discussions, and share valuable cybersecurity resources. The backend is built using Node.js, Express.js, and MongoDB, while the frontend uses HTML, CSS, and JavaScript. Authentication is handled securely with JWT tokens, and passwords are hashed using bcrypt.

## Features

- User Registration & Login
- JWT Authentication
- Forum for Posts
- Cybersecurity Resource Sharing
- Protected Routes with Role-based Access
- Frontend with HTML, CSS, and JavaScript

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Authentication)
- bcrypt (Password Hashing)
- HTML, CSS, JavaScript (Frontend)

## Setup

1. Clone the repo:
   git clone https://github.com/ProCyberX/CyberSafe-A-Student-Cybersecurity-Sharing-Platform.git

2. Install dependencies
   npm install

3. Create a .env file and add:
   JWT_SECRET=your-secret
   MONGODB_URI=your-uri
   PORT=3000

4. Start the server:
   node server.js

5. Open your browser to http://localhost:3000

Author:
Khwairakpam Prosenjit (@ProCyberX)