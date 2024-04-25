import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password: {
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    avatar:{
        type:String,
    }
},{timestamps:true});

export const User = mongoose.model('User',userSchema);