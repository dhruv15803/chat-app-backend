import express from 'express'
import { createMessage, deleteMessage, editMessage, getConversation, getMessagesFromLoggedInUser, getMessagesFromSenderId } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/user.middleware.js';

const router = express.Router();

router.post('/create',protectRoute,createMessage);
router.get('/getMessages/:senderId',protectRoute,getMessagesFromSenderId);
router.get('/getMessagesLoggedIn/:receiverId',protectRoute,getMessagesFromLoggedInUser);
router.get('/getConversation/:receiverId',protectRoute,getConversation);
router.delete('/deleteMessage/:receiverId/:messageId',protectRoute,deleteMessage);
router.put('/editMessage',protectRoute,editMessage);



export default router;