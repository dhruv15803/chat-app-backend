import getCloudinaryUrl from "../utils/getCloudinaryUrl.js";
import { User } from "../models/user.model.js";
import fs from 'fs';
const getAvatarUrl = async (req, res) => {
    try {
        if (!req.file?.path) {
            res.status(400).json({
                success: false,
                message: "file not available",
            });
            return;
        }
        const filePath = req.file.path;
        const url = await getCloudinaryUrl(filePath, res);
        if (!url) {
            return res.status(500).json({
                success: false,
                message: "cloudinary service failed",
            });
        }
        fs.unlinkSync(filePath);
        res.status(200).json({
            success: true,
            url,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getLoggedInUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { getAvatarUrl, getLoggedInUser };
