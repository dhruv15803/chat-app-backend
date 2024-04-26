import { Message } from '../models/message.model.js';
const createMessage = async (req, res) => {
    try {
        // need to be logged in to create/send a message
        // protected route
        const { senderId, receiverId, message } = req.body;
        if (senderId !== req.userId) {
            res.status(400).json({
                "success": false,
                "message": "senderId is not equal to logged in user's id"
            });
            return;
        }
        if (message.trim() === "") {
            res.status(400).json({
                "success": false,
                "message": "message field is empty"
            });
            return;
        }
        const newMessage = await Message.create({ senderId, receiverId, message });
        res.status(201).json({
            'success': true,
            "message": "sent message successfully",
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getMessagesFromSenderId = async (req, res) => {
    try {
        const { senderId } = req.params;
        const receiverId = req.userId;
        const messages = await Message.find({ senderId, receiverId });
        res.status(200).json({
            "success": true,
            messages,
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { createMessage, getMessagesFromSenderId };
