import express from 'express'
import { createMessage, getConversation, getMessagesFromLoggedInUser, getMessagesFromSenderId } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/create',protectRoute,createMessage);
router.get('/getMessages/:senderId',protectRoute,getMessagesFromSenderId);
router.get('/getMessagesLoggedIn/:receiverId',protectRoute,getMessagesFromLoggedInUser);
router.get('/getConversation/:receiverId',protectRoute,getConversation);



export default router;