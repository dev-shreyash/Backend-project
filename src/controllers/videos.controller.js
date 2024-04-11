import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import {uploadOnCloudinary, uploadVideoToCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
import{Video} from  '../models/video.model.js';
import mongoose, { isValidObjectId } from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType, userId } = req.query
    console.log("Request Query Parameters:", req.query)

    const skipedVideos = (page - 1) * limit

    const sortingVideo = {}
    if (sortBy && sortType) {
        sortingVideo[sortBy] = sortType === "asc" ? 1 : -1
    } else {
        sortingVideo["createdAt"] = -1
    }

    try {
        if (!userId) {
            throw new ApiError(400, "User ID not found")
        }

        const videos = await Video.find({ owner: userId })
            .sort(sortingVideo)
            .skip(skipedVideos)
            .limit(parseInt(limit))

        if (videos.length === 0) {
            throw new ApiError(404, "No videos found for the user")
        }

        videos.forEach(video => {
            const videoOwner = video.owner?.toString()
            console.log("videoOwner: ", videoOwner)
        });

        res.status(200).json(new ApiResponse(200, videos, "Successfully fetched videos"))
    } catch (error) {
        console.error('Error getting videos:', error);
        throw new ApiError(500, 'Server error, failed to fetch videos')
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!(title && description)) {
        throw new ApiError(400, "title and description is required");
      }

    if (!videoLocalPath) {
        throw new ApiError(400, 'Video file is required')
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, 'Thumbanil file is required')
    }

    try {
        const videoUrl = await uploadOnCloudinary(videoLocalPath)
        const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath)

        if (!(videoUrl && thumbnailUrl)) {
            throw new ApiError(400, "Url not found");
          }
        const video = await Video.create({
            title,
            description,
            videoFile:videoUrl.url,
            thumbnail:thumbnailUrl.url,
            duration:videoUrl.duration,
            isPublished:false,
            owner:req.user._id
        });

        return res.status(201).json(new ApiResponse(200, video, 'Video published successfully'))
    } catch (error) {
        console.error('Error publishing video:', error)
        throw new ApiError(500, 'Server error, failed to publish video')
    }
})


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
      // get video by id

      if(!videoId){
        new ApiError(404, "Not Found Video Id")
      }

      const video = await Video.findById({videoId})

      if (!(video && video.isPublished)) {
        throw new ApiError(400, "Something wrong");
      }

      return res.status(200).json(new  ApiResponse(200, video, "This is a single video"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //update video details like title, description, thumbnail
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is not valid")
      }l
   const video = await Video.findById(videoId);

   try {
     if (!(video && videoowner === req.user._id)) {
       throw new ApiError(400, "video not founded");
     }
   
     const { title, description } = req.body;
     const localThumbnail = req.file?.path;
   
     if (!(title && description)) {
       throw new ApiError(404, "not founded anything");
     }
     if (!localThumbnail) {
       throw new ApiError(404, "Not founded local path for thumbnail");
     }
   
   
     const thumbnail = await uploadOnCloudinary(localThumbnail);
   
     if (!localThumbnail) {
       throw new ApiError(404, "Not found thumbnail url");
     }
     const updatedVideoDetails = await Video.findByIdAndUpdate(videoId, {
       title,
       description,
       thumbnail: thumbnail?.url,
     });
   
     return res.status(200).json(new ApiResponse(200, updatedVideoDetails, "Successfully updated"));
 
   } catch (error) {
    console.error('Error updating video:', error)
    throw new ApiError(500, 'Server error, failed to update video') 
   }
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    try {
        if(!videoId){
            throw new ApiError(404, "Video not found")
        }
        const video = await Video.findById(videoId)

        const videoOwner = await video?.owner?._id.toString()
       // console.log("videoOwnerId: ",videoOwner)
        
        const user = await req.user?._id.toString()
       // console.log("userId: " ,user)
  
  
          if (!(video && videoOwner === user)) {
            throw new ApiError(400,"Your not eligible to delete video");

        }

        const deleteVideo= await Video.findByIdAndDelete(videoId)

        return res.status(200).json(new ApiResponse(200, "Successfully deleted the video"))
    } catch (error) {
        console.error('Error deleting video:', error)
        throw new ApiError(500, 'Server error, failed to delete video')     
    }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const  videoId  = req.params.videoId
    console.log("videoId: ",videoId)

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is not valid")
      }
      
    const video = await Video.findById(videoId)

      const videoOwner = await video?.owner?._id.toString()
     // console.log("videoOwnerId: ",videoOwner)
      
      const user = await req.user?._id.toString()
     // console.log("userId: " ,user)


    try {
        if (!(video && videoOwner === user)) {
            throw new ApiError(400, "You are not eligible to publish video");
          }

          const isPublished= !video.isPublished

          const togglesPublish= await Video.findByIdAndUpdate(videoId, {
             $set:{isPublished: isPublished} 
          }, {new: true}) 

          if(!togglesPublish){
            throw new ApiError(400, "Something went wrong to toggle the publish state");
          }
          return res.status(200).json(new ApiResponse(200, "Successfully published video", await video))
    } catch (error) {
         console.error('Error publishing video:', error)
        throw new ApiError(500, 'Server error, failed to publish video')     
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}