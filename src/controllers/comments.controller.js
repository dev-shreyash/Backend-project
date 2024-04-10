import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"



const getVideoComments = asyncHandler(async(req, res)=>{
    const videoId=req.params.videoId

    const{page=1,limit=10}=req.query
    try {

        if(!videoId){
            throw new ApiError(400,"video not found")
        }


        
    } catch (error) {
        console.error('Error getting comments:', error)
        throw new ApiError(500, 'Server error, failed to get comments')     
    }
})


const addComment =asyncHandler(async(req,res)=>
{
    const videoId=req.params.videoId
    const {userId, content}=req.body

   try {
     if(!userId){
         throw new ApiError(400,"userid not found")
     }
     if(!videoId){
         throw new ApiError(400,"video not found")
     }
     if(!content){
        throw new ApiError(400,"content not found")
     }

     const comment = await Comment.create({
        owenr:userId,
        video:videoId,
        content
     })
     if(!comment){
        throw new ApiError(400,"error while creating comment")
     }

     return res.status(200).json(new ApiResponse(200, comment, "Successfully created comment"))
     
   } catch (error) {
    console.error('Error adding comments:', error)
    throw new ApiError(500, 'Server error, failed to add comments')     
   }
})



export {getVideoComments, addComment}