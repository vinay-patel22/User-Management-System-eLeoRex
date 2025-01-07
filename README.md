# User Management System

This is a Full-Stack User Management System developed as part of a technical evaluation.  
The application includes user and role management features with role-based access control.

## Features

- User registration and authentication (JWT)
- Role-based access control
- CRUD operations for users and roles
- Responsive and user-friendly interface

## Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- MongoDB
- Git

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/vinay-patel22/User-Management-System-eLeoRex.git
   cd User-Management-System-eLeoRex
   ```

2. **Install Dependencies**

   - Backend:
     ```bash
     npm install
     ```
   - Frontend:
     ```bash
     cd client
     npm install
     ```

3. **Set Up Environment Variables**

   - Create a `.env` file in the root directory with the following content:
     ```env
     MONGO=your_mongo_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. **Run the Application**

   - Backend:
     ```bash
     npm run dev
     ```
   - Frontend:
     ```bash
     cd client
     npm run dev
     ```

5. **Assign Admin Role**
   - Initially, all users have the "user" role by default.
   - To assign the "admin" role, update the user's role manually in the database.
