# Backend Project - Video Streaming App

## Introduction

This backend project is developed by Shreyash Bhosale using Node.js and Express framework for a video streaming application. Below is a brief overview of the project setup and functionalities implemented.

## Project Setup

- Initialized project using npm command `npm init -y`.
- Added dependencies such as mongoose, MongoDB, express, etc.
- Added dev dependencies like nodemon, prettier, etc.
- Defined environment variables in an env file.
- Set up git and pushed the code to a GitHub repository.

## Features Implemented

- **Database Connection:** Established a connection with MongoDB.
- **Error/Response/Async Handling:** Implemented utilities for error handling, response formatting, and async middleware.
- **Model Schema:** Defined schema for models such as user, like, playlist, video, comment, subscription, dashboard.
- **Middleware:** Added middleware for authentication and file handling using multer.
- **Authentication:** Implemented user registration, login, token refresh, change password, and getCurrentUser controllers. JWT tokens are used for authentication.
- **File Handling:** Implemented file handling using multer and Cloudinary for uploading avatars, cover images, etc.
- **Routes:** Defined essential routes in the /routes folder to handle various requests.
- **Controllers:** Implemented controllers to handle user registrations, user data, like, playlist, video, comment, subscription, dashboard functionalities.
- **Testing:** Tested all functionalities using Postman for every controller.

## How to Run

1. Clone the repository from GitHub.
2. Navigate to the backend directory.
3. Run `npm install` to install dependencies.
4. Set up the environment variables in the .env file.
5. Run `npm start` to start the server.
6. Test the endpoints using Postman or any API testing tool.

## Conclusion

This backend project provides a solid foundation for building a video streaming application. It incorporates essential features such as user authentication, data handling, file upload, and various functionalities related to videos, comments, likes, playlists, subscriptions, and dashboard. Further enhancements and optimizations can be made based on specific project requirements.