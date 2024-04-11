import mongoose, { isValidObjectId }  from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse }from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"

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
    const user = req.user._id
    try {
        if(!videoId){
            throw new ApiError(400,"Video Id is required")
        }
        const video = await Video.findById(videoId);

         if (!video || !video.isPublished) {
           throw new ApiError(404, "Video not found or not published");
        }


        const checkAlreadyLiked = await Like.findOne({likedBy:user,video:videoId})
        if(checkAlreadyLiked){
            await Like.deleteOne({ _id: checkAlreadyLiked._id })
            return res.status(200).json(new ApiResponse(200, "Like removed successfully"))
        }

        const addLike = await Like.create({
            user,
            video:videoId
        })
        if (!addLike) {
            throw new ApiError(400, "Video is unabled to like");
          }
         return res.status(200).json(new ApiResponse( 200,addLike,"Successfully liked the video" ))
        
    } catch (error) {
        console.error('Error adding video Like:', error)
        throw new ApiError(500, 'Server error, failed to add video Like')     
 
    }

})


export {toggleVideoLike, getVideoLikesCount}