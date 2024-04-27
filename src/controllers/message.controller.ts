import jwt from 'jsonwebtoken'
import { Request,Response} from 'express'
import { Message } from '../models/message.model.js';
import { Conversation } from '../models/conversation.model.js';
import mongoose from 'mongoose';


const createMessage = async (req:Request,res:Response) => {
    try {
    // need to be logged in to create/send a message
    // protected route
    let newConversation;
    const {senderId,receiverId,message}:{senderId:string;receiverId:string;message:string} = req.body;
    if(senderId!==req.userId) {
        res.status(400).json({
            "success":false,
            "message":"senderId is not equal to logged in user's id"
        })
        return;
    }
    if(message.trim()==="") {
        res.status(400).json({
            "success":false,
            "message":"message field is empty"
        })
        return;
    }
    const newMessage = await Message.create({senderId,receiverId,message});
        // if there is no conversation between senderId and receiverId then create one and put message into it
    // else put this message in the conversation that already exists
    let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
    if(!conversation) {
        conversation = await Conversation.create({participants:[senderId,receiverId],messages:[newMessage._id]})
    } else {
        conversation.messages.push(newMessage._id);
        await conversation.save();
    }
    res.status(201).json({
        'success':true,
        "message":"sent message successfully",
        "sentMessage":newMessage,
    })
    } catch (error) {
      console.log(error);  
    }
}


const deleteMessage = async (req:Request,res:Response) => {
    try {
        let {receiverId,messageId} = req.params;
        const senderId = req.userId;
        
        const toBeDeletedMsg = await Message.findById(messageId);
        if(!toBeDeletedMsg) {
            return res.status(400).json({
                "success":false,
                "message":"message id not valid"
            })
        }
        const deleteMsgId = toBeDeletedMsg._id;
        let conversation = await Conversation.findOne({participants:{$all:[senderId,receiverId]}}).populate('messages');
        console.log(conversation);
        if(!conversation) {
            res.status(400).json({
                "success":false,
                "message":"conversation doesn't exist to delete a message"
            })
            return;
        }
        let messages = conversation?.messages;
        if(!messages) {
            res.status(400).json({
                "success":false,
                "message":"This conversation has no messages to delete"
            })
            return;
        }
        const newMessages = messages.filter((message) => message._id.toString()!==deleteMsgId.toString());
        conversation.messages = newMessages;
        await conversation.save();

        await Message.deleteOne({_id:messageId,senderId:senderId,receiverId:receiverId});

        res.status(200).json({
            "success":true,
            "message":"successfully deleted message"
        })
    } catch (error) {
        console.log(error);
    }
}


const editMessage = async (req:Request,res:Response) => {
    try {
        const {messageId,newMessage,receiverId}:{messageId:string;newMessage:string;receiverId:string} = req.body;
        const senderId = req.userId;
    
        if(newMessage.trim()==="") {
            res.status(400).json({
                "success":false,
                "message":"empty message entered while editing"
            })
            return;
        }
    
        // updating message
        await Message.updateOne({_id:messageId},{$set:{message:newMessage}});
        const updatedMessage = await Message.findOne({_id:messageId});
        res.status(200).json({
            "success":true,
            "message":"successfully edited message",
            updatedMessage,
        })
    } catch (error) {
        console.log(error);
    }
}


const getConversation = async (req:Request,res:Response) => {
    // protected route
    try {
        const {receiverId} = req.params;
        const senderId = req.userId;
        // get messages between sender and receiver from conversation
        const conversation = await Conversation.findOne({participants:{$all:[senderId,receiverId]}}).populate('messages');
        if(!conversation) {
            res.json({
                "success":false,
                "message":"send a message to start a conversation",
            })
            return;
        }
        const messages = conversation?.messages;
        res.status(200).json({
            "success":true,
            "conversationMessages":messages,
        })
    } catch (error) {
        console.log(error);
    }
} 



const getMessagesFromSenderId = async (req:Request,res:Response) => {
    try {
        const {senderId} = req.params;
        const receiverId = req.userId;
        const messages = await Message.find({senderId,receiverId});
        res.status(200).json({
            "success":true,
            messages,
        })
    } catch (error) {
        console.log(error);
    }
}


const getMessagesFromLoggedInUser = async (req:Request,res:Response) => {
    try {
        const {receiverId} = req.params;
        const senderId = req.userId;
        const messages = await Message.find({senderId,receiverId});
        res.status(200).json({
            "success":true,
            messages,
        })
    } catch (error) {
        console.log(error);
    }

}


export {
    createMessage,
    getMessagesFromSenderId,
    getMessagesFromLoggedInUser,
    getConversation,
    deleteMessage,
    editMessage,
}