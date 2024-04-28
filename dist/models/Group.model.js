import mongoose from 'mongoose';
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    participants: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
    messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        }]
}, { timestamps: true });
export const Group = mongoose.model('Group', groupSchema);
