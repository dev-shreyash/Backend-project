import dotenv from  'dotenv';
import connectDB from "./db/index.js";

dotenv.config({
    path:'./.env'
})


connectDB()
.then(()=>{
    a00.on("error",(err)=>{
        console.log("error",err)
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running on ${process.env.PORT}`)
    })
}

)
.catch((err)=>{
    console.log("mongoDB ocnnection failed",err)
})
