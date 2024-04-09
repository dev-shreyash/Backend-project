# Backend project done by Shareysh Bhosale


*Introduction:* 
This is a backend project developed using Node.js and Express framework for building backend for video streaming app

1>project setup
 *   Created a new directory named "backend"
 *   initialized npm  using the command `npm init -y`
 *   Added mongoose, mongoDB, express, etc. dependency's
 *   Added extra dev dependency's like nodemon, prettier etc.
 *   Defined env file
 *   git setup and pushed to github repo
 *   Database connection with mongoDB
 *   Error/response/async handling added in utils
 *   Created model schema in models
 *   Added middelware for auth and multer
 *   Added cookie-parser, bcrypt for user data handlin
 *   implemented jwt token handling
 *   implemneted file handling with multer, cloudinary

1.0>User Routes
 *   Defined essential routes in /routes folder

2>controllers setup
 *  defined controllerl to handle user registrations
 *  handled user data 
 *  successfully created user in database
 *  provided {registration, login, refreshAccessToken, changePassword, getCurrentUser, update:Profile-avatar-coverImage, get:channelProfile-watchHistory} controllers