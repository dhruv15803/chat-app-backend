import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { getAvatarUrl, getLoggedInUser } from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/user.middleware.js';
const router = express.Router();
router.post('/getAvatarUrl', upload.single('avatar'), getAvatarUrl);
router.get('/getLoggedInUser', protectRoute, getLoggedInUser);
export default router;
