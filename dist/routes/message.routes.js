import express from 'express';
import { createMessage, getMessagesFromSenderId } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/user.middleware.js';
const router = express.Router();
router.post('/create', protectRoute, createMessage);
router.get('/getMessages/:senderId', protectRoute, getMessagesFromSenderId);
export default router;
