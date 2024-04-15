import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const getChannelStats=asyncHandler(async(req,res)=>{
    const {channelId}=req.params
    const channel=await User.findById(channelId)    
    const user = req.user._id


    try {
       const getTotalViews= await Video.aggregate([
        {
            $match:{
                owner:user,
                isPublished:true
            }
        },
        {
            $group:{
                _id:null,
                totalViews:{$sum:"$views"}
            }
        },
        {
            $project:{
                _id:0,
                totalViews:1
            }
        }   
       ])

       if (!getTotalViews) {
        throw new ApiError(404, "Something went wrong in getTotalViews")
      }


      const getTotalSubscribers=await Subscription.aggregate([
        {
            $match:{
                subscribedTo:user
            }
        },
        {
            $group:{
                _id:null,
                totalSubscribers:{$sum:1}
            }
        } ,
        {
            $project:{
                _id:0,
                totalSubscribers:1
            }
        }
      ])
        
      if (!getTotalSubscribers) {
        throw new ApiError(404, "Something went wrong in totalsubscribers")
      }


      const getTotalLikes=await Like.aggregate([
        {
            $match:{
                likedBy:user
            }
        },
        {
         $group:{
                _id:null,
                totalLikes:{$sum:1}
            }
        },
        {
            $project:{
                _id:0,
                totalLikes:1
            }
        }
      ])
      if (!getTotalLikes) {
        throw new ApiError(404, "Something went wrong in totalLikes")
      }

      const getTotalVideos = await Video.aggregate([
        {
          $match: {
            owner: req.user?._id,
            isPublished: true,
          },
        },
        {
          $group: {
            _id: null,
            totalVideo: { $sum: 1 },
          },
        },
        {
          $project: {
            totalVideo: 1,
          },
        },
      ])

      if (!getTotalVideos) {
        throw new ApiError(404, "Something went wrong in total Videos")
      }

      res.status(200).json(
        new ApiResponse(200, { getTotalViews, getTotalSubscribers, getTotalLikes, getTotalVideos }, "Successfully got the channel states")
      )
        
    } catch (error) {
        console.error('Error getting channel stats:', error)
        throw new ApiError(500, 'Server error, failed to get channel stats')    
    }
})

const getChannelVideos=asyncHandler(async(req,res)=>{
    try {
        const aggregate = [
          {
            $match: {
              owner: req.user?._id,
              isPublished: true,
            },
          },
        ];
    
        const videoList = await Video.aggregate(aggregate)
    
        if (!videoList || videoList.length === 0) {
          res.status(200).json(new ApiResponse(200, videoList, "No video founded"))
        }
    
        res
          .status(200)
          .json(new ApiResponse(200, videoList, "Successfully got the videos"))
      } catch (error) {
        console.error('Error getting channel videos:', error)
        throw new ApiError(400, error, "Something wrong in getting channel video")
      }
    
})




export {
    getChannelStats,
    getChannelVideos
}