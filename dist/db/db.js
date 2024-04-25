import mongoose from "mongoose";
const connectToDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
        console.log('DB CONNECTED');
    }
    catch (error) {
        console.log('DB ERROR:- ', error);
    }
};
export default connectToDb;
