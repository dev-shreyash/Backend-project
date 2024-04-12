import mongoose, { isValidObjectId }  from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse }from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"

const getVideoLikesCount = asyncHandler(async(req,res)=>{
    const videoId=req.params.videoId

    try {
        if(!videoId){
            throw new ApiError(400,"Video Id is required")
        }
        
        const likesCount = await Like.countDocuments({ video: videoId })
        console.log(likesCount)

        return res.status(200).json(new ApiResponse( 200,likesCount,"Successfully fetched likes count of the video" ))


    } catch (error) {
        console.error('Error getting video Likes:', error)
        throw new ApiError(500, 'Server error, failed to get video Likes')     
 
    }
})


const toggleVideoLike =asyncHandler(async(req,res)=>{
    const videoId=req.params.videoId
    const userId = req.user._id
    try {
        if(!videoId){
            throw new ApiError(400,"Video Id is required")
        }
        const video = await Video.findById(videoId);


         if (!video || !video.isPublished) {
           throw new ApiError(404, "Video not found or not published");
        }

        const checkAlreadyLiked = async (userId, videoId) => {
            const existingLike = await Like.findOne({ likedBy: userId, video: videoId })
            return existingLike
        };
        
        const alreadyLiked = await checkAlreadyLiked(userId, videoId)
        
        if (!alreadyLiked) {
            const addLike = await Like.create({
                likedBy: userId,
                video: videoId
            });
            if (!addLike) {
                throw new ApiError(400, "Video is unable to be liked")
            }
            return res.status(200).json(new ApiResponse(200, addLike, "Successfully liked the video"))
        } else {
            await Like.deleteOne({ _id: alreadyLiked._id }) // Delete the existing like based on its _id
            return res.status(200).json(new ApiResponse(200, "Like removed successfully"))
        }
        
        
    } catch (error) {
        console.error('Error adding video Like:', error)
        throw new ApiError(500, 'Server error, failed to add video Like')     
 
    }

})

const getCommentLikesCount = asyncHandler(async(req,res)=>{
    const commentId=req.params.commentId

    try {
        if(!commentId){
            throw new ApiError(400,"comment Id is required")
        }
        
        const likesCount = await Like.countDocuments({ comment: commentId })
        console.log(likesCount)

        return res.status(200).json(new ApiResponse( 200,likesCount,"Successfully fetched likes count of the comment" ))


    } catch (error) {
        console.error('Error getting comment Likes:', error)
        throw new ApiError(500, 'Server error, failed to get comment Likes')     
 
    }
})

const toggleCommentLike =asyncHandler(async(req,res)=>{
    const commentId=req.params.commentId
    const user = req.user._id
    try {
        if(!commentId){
            throw new ApiError(400,"comment Id is required")
        }
        const comment = await Comment.findById(commentId);

         if (!comment || !comment.isPublished) {
           throw new ApiError(404, "comment not found or not published");
        }

        const checkAlreadyLiked = async (user, commentId) => {
            const existingLike = await Like.findOne({ likedBy: user, comment: commentId })
            return existingLike
        };
        
        const alreadyLiked = await checkAlreadyLiked(user, commentId)
        
        if (!alreadyLiked) {
            const addLike = await Like.create({
                likedBy:user,
                comment: commentId
            });
            if (!addLike) {
                throw new ApiError(400, "comment is unable to be liked")
            }
            return res.status(200).json(new ApiResponse(200, addLike, "Successfully liked the comment"))
        } else {
            await Like.deleteOne({ _id: alreadyLiked._id }) // Delete the existing like based on its _id
            return res.status(200).json(new ApiResponse(200, "Like removed successfully"))
        }
        
        
    } catch (error) {
        console.error('Error adding comment Like:', error)
        throw new ApiError(500, 'Server error, failed to add comment Like')     
 
    }

})

const getLikedVideos=asyncHandler(async(req,res)=>{
   const user=req.user?._id.toString()

   console.log(user)

   if(!user){
    throw new ApiError(400,"user id is required")
   }

   try {
    const likedVideos = await Like.find({ likedBy:user })
    .populate({
      path: 'video',
      model: 'Video',
    })
    .exec();
  
  console.log("Liked videos:", likedVideos);
    if (!likedVideos || likedVideos.length === 0) {
        throw new ApiError(404, "No liked videos found for the user");
    }
    return res.status(200).json(new ApiResponse(200, likedVideos, "Successfully fetched liked videos"));
    
   } catch (error) {
    console.error('Error fetching liked videos:', error)
    throw new ApiError(500, 'Server error, failed to fetch liked videos')     
   }
})


const getLikedComments=asyncHandler(async(req,res)=>{
    const user=req.user?._id.toString()
 
    console.log(user)
 
    if(!user){
     throw new ApiError(400,"user id is required")
    }
 
    try {
     const likedComments = await Like.find({ likedBy:user })
     .populate({
       path: 'comment',
       model: 'Comment',
     })
     .exec();
   
   console.log("Liked comments:", likedComments);
     if (!likedComments || likedComments.length === 0) {
         throw new ApiError(404, "No liked comments found for the user");
     }
     return res.status(200).json(new ApiResponse(200, likedComments, "Successfully fetched liked comments"));
     
    } catch (error) {
     console.error('Error fetching liked comments:', error)
     throw new ApiError(500, 'Server error, failed to fetch liked comments')     
    }
 })
 


export {toggleVideoLike, getVideoLikesCount, getCommentLikesCount, toggleCommentLike, getLikedVideos, getLikedComments}