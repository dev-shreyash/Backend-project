import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'

const generateAccessAndrefressToken =async(userId)=>{
    try{
        const user =await User.findById(userId)
        const accessToken =await user.generateAccessToken()
        const refreshToken= user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false}) 

        return {accessToken,refreshToken}

    }catch{
        throw new ApiError(500,'server error in generating token')
    }
}


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

//login funcutionality
const loginuser =asyncHandler( async (req,res)=>{
    //login logic

    //1) req data from body

    const {email,username,password} = req.body
     console.log(email)
    

    //2)username/email
    if( !email && !username ){
        throw new ApiError(400,"provide an email or a username ")
    }

    //3)find user
    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(400,"user dose not exist")
    }

    //4)password check
     const passcheck = await user.isPasswordCorrect(password)
    if(!passcheck){
        throw new ApiError(401,  'Incorrect password')
    }
    //5)access and refresh token
    const {accessToken, refreshToken }=await generateAccessAndrefressToken(user._id)

    //6)send cookie
    const loggedUser= await User.findById(user._id).select('-password -refreshToken' )
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie( "refreshToken" ,refreshToken,'options')
    .json(
        new ApiResponse(200,
            {
                user:loggedUser, accessToken
            },
            "User logged In Successfully"
            )
    )
})




const logoutuser = asyncHandler(async (req, res) => {
    try {
        // Remove refresh token from the user document in the database
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        );

        // Clear cookies
        const options = {
            httpOnly: true,
            secure: true
        };

        res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out"));
    } catch (error) {
        // Handle errors
        console.error("Error logging out user:", error);
        res.status(500).json(new ApiResponse(500, {}, "Server error during logout"));
    }
});





export {
        registerUser,
        loginuser,
        logoutuser
}