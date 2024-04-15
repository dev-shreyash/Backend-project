import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const channelId  = req.params.channelId
    const userId = req.user._id
    //toggle subscription
    if (!channelId) {
        throw new ApiError(400, "Not found channel id")
    }
    try {
        const channel = await User.findById(channelId)
        if (!channel) {
            throw new ApiError(404, "Channel does not exits")
        }
    
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User not found")
        }
    
        const subscriber = await Subscription.find({
            subscriber: userId,
            channel: channelId
        })
    
        let toggle
        if (subscriber.length === 0) {
            toggle = await Subscription.create({
                subscriber: userId,
                channel: channelId
            })
            if (!toggle) {
                throw new ApiError(400, "Something went wrong, while subscribing")
            }
        } else {
            toggle = await Subscription.findByIdAndDelete(subscriber[0]._id)
            res.status(200).json(
                new ApiResponse(200, "Successfully unsubscribed")
            )
            if (!toggle) {
                throw new ApiError(400, "Failed to unsubscribe");
            }
        }
    
        
        res.status(200).json(
            new ApiResponse(200, toggle, "Successfully subscribed")
        )
    } catch (error) {
        console.error('Error subscribing channel:', error)
        throw new ApiError(500, 'Server error, failed to subscribe channel')     
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId) {
        throw new ApiError(400, "Not found channel id")
    }

    try {
        const channel = await User.findById(channelId)
        if (!channel) {
            throw new ApiError(404, "Channel does not exits")
        }
    
        const aggregate = [
            {
                $match: {
                    channel: channelId
                }
            }, {
                $group: {
                    _id: null,
                    totalCount: { $sum: 1 } 
                }
            }
        ]
    
    
        const subscriberList = await Subscription.aggregate(aggregate)
    
        if (!subscriberList || subscriberList.length === 0) {
            throw new ApiError(404, "Subscriberes not founded")
        }
    
        res.status(200).json(
            new ApiResponse(200, subscriberList, "Successfully got the subscribers")
        )
    } catch (error) {
        console.error('Error getting subscribers:', error)
        throw new ApiError(500, 'Server error, failed to get subscribers')  
    }
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriberId = req.user._id

    if (!subscriberId) {
        throw new ApiError(400, "Subscriber ID not found")
    }

    try {
        const user = await User.findById(subscriberId);
        if (!user) {
            throw new ApiError(404, "User does not exist")
        }

        const subscribedList = await Subscription.find({ subscriber: subscriberId }).populate('channel')

        if (!subscribedList || subscribedList.length === 0) {
            throw new ApiError(404, "Subscribers not found")
        }

        res.status(200).json(new ApiResponse(200, subscribedList, "Successfully got the subscribed channels"))
    } catch (error) {
        console.error('Error getting subscribed channels:', error)
        throw new ApiError(500, 'Server error, failed to get subscribed channels')
    }
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}