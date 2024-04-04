import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async(req,res)=>{
   //logic to register user
   //1)get details, 2)validate, 3)check if user already exits, 4)check for files, 5)upload to cloudinary. 6)create user object, 7)remove non-required fields from response, 8)check for user creation, 9)return res

   //details 
   const {fullName, email, username, password} = req.body
   console.log('registering a new user', fullName)

   //validation
   if(
    [fullName, email, username, password].some((field)=>
    field?.trim() === "") 
   ){
    throw new ApiError(400,"Please provide your All Details")
   }

   //cheaking  for existing user 
   const existeduser = await User.findOne({
    $or: [{email}, {username}]
   })
   
   if(existeduser){
    throw new ApiError(409, 'user already exists')
   }
   console.log(req.files)
   //filehandling
   const avatarLocalPath=req.files?.avatar[0]?.path
   //const coverImageLocalpath=req.files?.coverImage[0]?.path
   let coverImageLocalPath
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
       coverImageLocalPath=req.files?.coverImage[0]?.path

   }

   if(!avatarLocalPath){
    throw new ApiError(400,'avatar file is required')
   }
   const avatarImageUrl= await uploadOnCloudinary(avatarLocalPath)
   const coverImageUrl= await uploadOnCloudinary(coverImageLocalPath)
   if(!avatarImageUrl){
    throw new ApiError(400,'avatar url is required')
   }

   //user creation in db
   const user = await User.create({
    fullName,
    avatar:avatarImageUrl.url,
    coverImage:coverImageUrl?.url || "",
    email,
    password,
    username:username.toLowerCase(),
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