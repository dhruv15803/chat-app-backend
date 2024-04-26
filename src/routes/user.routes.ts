import express from 'express'
import { upload } from '../middlewares/multer.middleware.js';
import { getAllUsers, getAvatarUrl, getLoggedInUser } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/user.middleware.js';

const router = express.Router();


router.post('/getAvatarUrl',upload.single('avatar'),getAvatarUrl);
router.get('/getLoggedInUser',protectRoute,getLoggedInUser);
router.get('/getAllUsers',protectRoute,getAllUsers);

export default router;