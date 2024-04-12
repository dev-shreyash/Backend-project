import mongoose, { isValidObjectId }  from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"



const getVideoComments = asyncHandler(async(req, res)=>{
    const videoId=req.params.videoId

    const{page=1,limit=10}=req.query
    try {

        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Video id is not valid");
        }
        
        const comments = await Comment.find({ video: videoId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec()
     console.log(comments)
    if (!comments || !Array.isArray(comments) || comments.length === 0) {
        throw new ApiError(404, "Comments not found")
    }
    return res.status(200).json(new ApiResponse(200, comments, "Successfully fetched comments"))

    } catch (error) {
        console.error('Error getting comments:', error)
        throw new ApiError(500, 'Server error, failed to get comments')     
    }
})

const addComment =asyncHandler(async(req,res)=>
{
    const videoId=req.params.videoId
    const {content}=req.body
    const userId=req.user._id.toString()

  //  console.log("userID: ",userId,"\ncontent: ",content)

   try {
     if(!userId){
         throw new ApiError(400,"userId not found")
     }
     if(!videoId){
         throw new ApiError(400,"video not found")
     }
     if(!content){
        throw new ApiError(400,"content not found")
     }
     const video = await Video.findById(videoId);
     if (!video || !video.isPublished) {
         throw new ApiError(400, "Video not founded or publi");
     }

     const comment = await Comment.create({
        owner:userId,
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
    
    const {commentId}=req.params

    const{ updatedContent, userId}=req.body

    const comment = await Comment.findById(commentId)


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
        const commentOwner= await comment?.owner?._id.toString()
       // console.log("commentOwner: ",commentOwner)

        if (userId !== commentOwner) {
            throw new ApiError(403, "You are not allowed to update this comment");
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
        return res.status(200).json(new ApiResponse(200, updatedComment, "Successfully updated the comment"));


    } catch (error) {
        console.error('Error updating comments:', error)
        throw new ApiError(500, 'Server error, failed to update comments')         
    }
})

const deleteComment =asyncHandler(async(req,res)=>{
    const commentId=req.params.commentId
    const userId=req.user._id.toString()

    console.log(userId)
    const comment = await Comment.findById(commentId)
    const commentOwner= await comment?.owner?._id.toString()
    console.log(commentOwner)

    if (userId !== commentOwner) {
        throw new ApiError(403, "You are not allowed to delete this comment");
    }
    try {
        if(!commentId){
            throw new ApiError(400,"comment not found")
        }

        const deletingComment = await Comment.findByIdAndDelete(commentId)

        if(!deletingComment){
            throw new ApiError(400,"error while deleting comment")
        }
        return res.status(200).json(new ApiResponse(200, "Successfully deleted comment"))

    } catch (error) {
        console.error('Error deleting comments:', error)
        throw new ApiError(500, 'Server error, failed to delete comments')     
    
    }
})

export {getVideoComments, addComment, updateComment, deleteComment}