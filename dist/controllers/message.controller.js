import { Message } from '../models/message.model.js';
import { Conversation } from '../models/conversation.model.js';
const createMessage = async (req, res) => {
    try {
        // need to be logged in to create/send a message
        // protected route
        let newConversation;
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
        // if there is no conversation between senderId and receiverId then create one and put message into it
        // else put this message in the conversation that already exists
        let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
        if (!conversation) {
            conversation = await Conversation.create({ participants: [senderId, receiverId], messages: [newMessage._id] });
        }
        else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }
        res.status(201).json({
            'success': true,
            "message": "sent message successfully",
            "sentMessage": newMessage,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getConversation = async (req, res) => {
    // protected route
    try {
        const { receiverId } = req.params;
        const senderId = req.userId;
        // get messages between sender and receiver from conversation
        const conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } }).populate('messages');
        if (!conversation) {
            res.json({
                "success": false,
                "message": "send a message to start a conversation",
            });
            return;
        }
        const messages = conversation?.messages;
        res.status(200).json({
            "success": true,
            "conversationMessages": messages,
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
const getMessagesFromLoggedInUser = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.userId;
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
export { createMessage, getMessagesFromSenderId, getMessagesFromLoggedInUser, getConversation, };
