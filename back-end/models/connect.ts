import mongoose from 'mongoose'
import dotenv from "dotenv";

dotenv.config();


const connectDB = async () => {
    const mongoURL = process.env.MONGODB as string;
    try{
        await mongoose.connect(mongoURL || 'mongodb://127.0.0.1:27017/AquaGo');
        console.log('MongoDB connected!!')
    } catch (err: any){
        console.error('Error connecting to database', err.message)
    }
};

export default connectDB;