import {v2 as cloudinary} from 'cloudinary'
import fs  from "fs"
          
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});



const uploadOnCloudinary= async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        const response =await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto',
        })
      //  console.log("file is uploaded successfully",response.url)
      fs.unlinkSync(localFilePath)  
      return response

    }catch(err){
        fs.unlinkSync(localFilePath) //delete the file from local system
        return null
    }
}

// Upload video to Cloudinary
const uploadVideoToCloudinary =async (localFilePath)=> {
  try {
    if(!localFilePath) return null

      const result = await cloudinary.uploader.upload(localFilePath, {
          resource_type: 'video',

          metadata:true
      });
      console.log('Uploaded video to Cloudinary:', result)
     // fs.unlinkSync(localFilePath) 
      return result
  } catch (error) {
     // fs.unlinkSync(localFilePath) 
      console.error('Error uploading video to Cloudinary:', error)
      throw error
  }
}


export {uploadOnCloudinary,uploadVideoToCloudinary}