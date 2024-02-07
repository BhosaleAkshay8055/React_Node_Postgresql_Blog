# React and Node.js Blog Application

Welcome to the React and Node.js Blog Application! This project allows users to register, log in, add blogs, and view a list of blogs. The backend is implemented in Node.js with two database options: SQLite3 and PostgreSQL.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Future Scope](#future-scope)

## Features

- User Registration and Login
- Blog Creation and Deletion
- Responsive UI
- Backend Support for SQLite3 and PostgreSQL

## Technologies Used

- React.js
- Node.js
- Express.js
- SQLite3 (or PostgreSQL)
- Multer for File Uploads
- Other dependencies (listed in package.json files)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/BhosaleAkshay8055/React_Node_Postgresql_Blog.git
   cd react-node-blog
   ```
   for run backend
   ```bash
   
   cd blog-backend
   npm install
   node serversqlite.js
   ```
   for run frontend
   ```
   cd frontend
   npm install
   npm start
   ```
## Usage
1. Register a new user account.
2. Log in with the registered account.
3. Add a new blog with a title, content, and image.
4. View the list of blogs on the homepage.
5. Delete a blog by clicking on the delete button.

6. The main part has, added protected route functionality
   1. In the backend use the serverauth.js file. ( password hash logic, JWT token created, database: SQLite-3)
   2. Only the login user can add a blog and delete the blog.

## Future Scope
   
   

