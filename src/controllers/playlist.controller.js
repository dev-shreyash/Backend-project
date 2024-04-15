import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist =asyncHandler(async(req,res)=>{
    const {name,description} = req.body
    const user =req.user._id
    if(!user){
        throw new ApiError(400, 'user id required')     
     }
     if(!(name || description)){
        throw new ApiError(400, 'name and description required')     
     }
   try {
     const playlist = await Playlist.create({
         name:name,
         description:description,
         owner:user
     })
     if(!playlist){
        throw new ApiError(400, 'failed to create playlist')     
     }
     return res.status(200).json(new ApiResponse(200, playlist, 'playlist created successfully'))
   } catch (error) {
    console.error('Error creating playlist:', error)
    throw new ApiError(500, 'Server error, failed to create playlist')     
   }

    
})


const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    try {
        if (!playlistId) {
            throw new ApiError(400, 'Playlist ID is required')
        }

        const playlist = await Playlist.findByIdAndUpdate(
            playlistId,
            { name, description },
            { new: true } 
        );

        if (!playlist) {
            throw new ApiError(404, 'Playlist not found')
        }

        return res.status(200).json(new ApiResponse(200, playlist, 'Playlist updated successfully'))
    } catch (error) {
        console.error('Error updating playlist:', error)
        throw new ApiError(500, 'Server error, failed to update playlist')
    }
})


const addVideoToPlaylist= asyncHandler(async(req,res)=>{
    const playlistId =req.params.playlistId
    const videoId =req.params.videoId


    if(!playlistId){
        throw new ApiError(400, 'playlist Id is requires')     
     }

     if(!videoId){
        throw new ApiError(400, 'video Id is requires')     
     }

     try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(404, 'Playlist not found');
        }
        
         const video = await Video.findById(videoId)
         
         if (!video || !video.isPublished) {
             throw new ApiError(400, "Video not founded");
         }

         playlist.videos.push(video)
         const newPlaylist =await playlist.save()

         if(!newPlaylist){
            throw new ApiError(400, 'failed to add video to playlist')     
         }

         return res.status(200).json(new ApiResponse(200, newPlaylist, 'playlist updated successfully'))

         
        
     } catch (error) {
        console.error('Error adding video to playlist:', error)
        throw new ApiError(500, 'Server error, failed to add video to playlist')         
     }
})

const removeVideoFromPlaylist= asyncHandler(async(req,res)=>{
    const playlistId =req.params.playlistId
    const videoId =req.params.videoId


    if(!playlistId){
        throw new ApiError(400, 'playlist Id is requires')     
     }

     if(!videoId){
        throw new ApiError(400, 'video Id is requires')     
     }

     try {
        const playlist = await Playlist.findById(playlistId)
        if(!playlist){
            throw new ApiError(400, 'playlist not found')     
         }
         const video = await Video.findById(videoId)
         
         if (!video || !video.isPublished) {
             throw new ApiError(400, "Video not founded");
         }

         const index = playlist.videos.indexOf(videoId);
         if (index > -1) {
             playlist.videos.splice(index, 1);
             await playlist.save();
         }
         return res.status(200).json(new ApiResponse(200, null, 'Successfully removed video from playlist'));
 
     } catch (error) {
        console.error('Error removing video from playlist:', error)
        throw new ApiError(500, 'Server error, failed from remove video to playlist')         
     }
})


const deletePlaylist =asyncHandler(async(req,res)=>{
    const playlistId=req.params.playlistId
    const userId=req.user._id.toString()

    console.log(userId)
    const playlist = await playlist.findById(playlistId)
    const playlistOwner= await playlist?.owner?._id.toString()
    console.log(playlistOwner)

    if (userId !== playlistOwner) {
        throw new ApiError(403, "You are not allowed to delete this playlist");
    }
    try {
        if(!playlistId){
            throw new ApiError(400,"playlist not found")
        }

        const deletingplaylist = await playlist.findByIdAndDelete(playlistId)

        if(!deletingplaylist){
            throw new ApiError(400,"error while deleting playlist")
        }
        return res.status(200).json(new ApiResponse(200, "Successfully deleted playlist"))

    } catch (error) {
        console.error('Error deleting playlist:', error)
        throw new ApiError(500, 'Server error, failed to delete playlist')     
    
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {

const { playlistId } = req.params

if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id is not a valid objectid");
}

const playlist = await Playlist.findById(playlistId);

if (!playlist) {
    throw new ApiError(404, "playlist not founded")
}

return res.status(200).json(new ApiResponse(200, playlist, "Successfylly got the playlist by Id"))

})


const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.params.userId

    if (!userId) {
        throw new ApiError(400, "User id is not valid")
    }

    try {
        const usersPlaylist = await Playlist.find(
            { 
                owner: userId 
            }
        )

        if (!usersPlaylist || usersPlaylist.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "No playlist found"))
        }

        return res.status(200).json(new ApiResponse(200, usersPlaylist, "Successfully fetched the playlist"))
    } catch (error) {
        console.error('Error fetching user playlists:', error)
        throw new ApiError(500, "Server error, failed to get user playlists")
    }
})


export {createPlaylist, updatePlaylist,addVideoToPlaylist, removeVideoFromPlaylist,deletePlaylist,getPlaylistById , getUserPlaylists}