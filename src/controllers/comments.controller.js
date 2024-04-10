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

        const pipeline=[
            {
                $match:{
                    videoId:mongoose.Types.ObjectId(videoId)
                }

            }
        ]
         
        const comments=await Comment.aggregate(pipeline)
        .sort({createdAt:-1})
        .skip((page-1)*limit)
        .limit(limit)
        .exec()
        
        if (!comments) {
            throw new ApiError(400,"comments not found") 
        }
        
    } catch (error) {
        console.error('Error getting comments:', error)
        throw new ApiError(500, 'Server error, failed to get comments')     
    }
})


const addComment =asyncHandler(async(req,res)=>
{
    const videoId=req.params
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



const updateComment = asyncHandler(async(req, res)=>
{
    //const videoId=req.params.videoId
    //const userId=req.user._id
    const commentId=req.params

    const{ updatedContent, userId}=req.body

    try {
        if(!commentId){
            throw new ApiError(400,"comment not found")
        }
       
        if(!updatedContent){
            throw new ApiError(400,"content not found")
        }
        if(!userId){
            throw new ApiError(400,"userid not found")
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
             {
                content:updatedContent
            },
            {new:true})

        if(!updatedComment){
            throw new ApiError(400,"error while updating comment")
        }
        return res.status(200).json(new ApiResponse(200, updatingComment, "Successfully updated the comment"));


    } catch (error) {
        console.error('Error updating comments:', error)
        throw new ApiError(500, 'Server error, failed to update comments')         
    }
})

const deleteComment =asyncHandler(async(req,res)=>{
    const commentId=req.params
    try {
        if(!commentId){
            throw new ApiError(400,"comment not found")
        }

        const deletingComment = await Comment.findByIdAndDelete(commentId)

        if(!deletingComment){
            throw new ApiError(400,"error while deleting comment")
        }
        
    } catch (error) {
        console.error('Error deleting comments:', error)
        throw new ApiError(500, 'Server error, failed to delete comments')     
    
    }
})

export {getVideoComments, addComment, updateComment, deleteComment}