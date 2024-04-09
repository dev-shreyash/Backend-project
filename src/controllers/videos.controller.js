import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js'
import {uploadOnCloudinary, uploadVideoToCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
import{Video} from  '../models/video.model.js';

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //get all videos based on query, sort, pagination
    console.log("Request Query Parameters:", req.query)
   
    const skipedVideos = (page - 1) * 10;

    const sortingVideo = {};
    if (sortBy && sortType) {
      sortingVideo[sortBy] = sortType === "ase" ? 1 : -1;
    } else {
      sortingVideo["createdAt"] = -1;
    }

    try {
        if(!userId){
            throw new ApiError(400, "user not found")
        }
        const aggregationPipeline = [
            { $match: { owner:userId } },
            { $sort: sortingVideo },
            { $skip: skipedVideos },
            { $limit: parseInt(limit) }
        ];

        // Execute the aggregation pipeline
        const videoList = await Video.aggregate(aggregationPipeline);

        res.status(200).json(new ApiResponse(200, videoList, "successfully get videos"))
    } catch (error) {
        console.error('Error getting videos:', error)
        throw new ApiError(500, 'Server error, failed to fetch videos') 
    }
})

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
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}