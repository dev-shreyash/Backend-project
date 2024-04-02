import dotenv from  'dotenv';
import express from "express"
import connectDB from "./db/index.js";

dotenv.config({
    path:'./.env'
})
//const app =express()

connectDB()
// (
//     async () => {
//         try{
//             await Mongoose.connect(`${process.env.MANGODB_URL}/${DB_NAME}`)
//             app.on("error",()=>{
//                 console.log('MongoDB connection error:', err);
//                 throw err
//             })
//             app.listen(process.env.PORT,()=>{
//                 console.log(`Server is running on port ${process.env.PORT}`);
//             })
//         }
//         catch (err) {
//             console.log('MongoDB connection error:', err);
//             throw err
//         }
//     })()