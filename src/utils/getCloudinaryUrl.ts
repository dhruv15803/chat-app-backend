import {v2 as cloudinary} from 'cloudinary';
import { Response } from 'express';
          
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET, 
});

const getCloudinaryUrl = async (filePath:string,res:Response) => {
    try {
        const cloudinaryResponse = await cloudinary.uploader.upload(filePath,{
            "resource_type":"auto",
        })
        const url = cloudinaryResponse?.url;
        if(!url) {
            return res.status(500).json({
                "success":false,
                "message":"cloudinary service failed",
            })
        }
        return url;
    } catch (error) {
        console.log(error);
    }
}

export default getCloudinaryUrl;