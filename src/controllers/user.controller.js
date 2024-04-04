import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async(req,res)=>{
   //logic to register user
   //1)get details, 2)validate, 3)check if user already exits, 4)check for files, 5)upload to cloudinary. 6)create user object, 7)remove non-required fields from response, 8)check for user creation, 9)return res

   //details 
   const {fullname, email, username, password} = req.body
   console.log('registering a new user', fullname)

   //validation
   if(
    [fullname, email, username, password].some((field)=>
    field?.trim() === "") 
   ){
    throw new ApiError(400,"Please provide your All Details")
   }

   //cheaking  for existing user 
   const existeduser =User.findOne({
    $or: [{email}, {username}]
   })
   
   if(existeduser){
    throw new ApiError(409, 'user already exists')
   }
   //filehandling
   const avatarLocalpath=req.files?.avatar[0]?.path
   const coverImageLocalpath=req.files?.coverImage[0]?.path


   if(!avatarLocalpath){
    throw new ApiError(400,'avatar is required')
   }
   const avatarImageUrl= await  uploadOnCloudinary(avatarLocalpath)
   const coverImageUrl= await  uploadOnCloudinary(coverImageLocalpath)
   if(!avatarImageUrl){
    throw new ApiError(400,'avatar is required')
   }

   //user creation in db
   const user = await User.create({
    fullname,
    avatar:avatarImageUrl.url,
    coverImage:coverImageUrl?.url || "",
    email,
    username:username.toLowerCase(),
    password
   })

   const createduser = await User.findById(user._id).select(
    "-password -refreshToken",
   )

   if (!createduser){
    throw new ApiError(500, "Server error, user not registred")
   }

   //return response

   return res.status(201).json(
    new ApiResponse(200, createduser, "user registerd succesfully")
   )

})


export {registerUser}