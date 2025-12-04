import {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import User from '../models/usersModel';
import ErrorHandler from '../middlewares/errorHandler';
import jwt, {Secret, JwtPayload} from 'jsonwebtoken';
require('dotenv').config();

export const registerUser = async (req : Request, res: Response) => {
    try{
        const {name, email, password, age, gender, activity_level, climate_type, height} = req.body;

        if(!name || !email || !password) {
            throw new ErrorHandler(400, 'Please fill all the fields!')
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ErrorHandler(400, 'Email already registered');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({name, email, password: hashedPassword, age, gender, activity_level, climate_type, height });
        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully', data : newUser});

    } catch (err: any){

        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }

        return res.status(err.statusCode || 500).json({ message: err.message || 'Server error!' });
    }
}

export const loginUser = async (req: Request, res : Response) => {
    try{
        const {email, password} = req.body;

        if(!email || !password) {
            throw new ErrorHandler(400, 'Please fill all the fields!');
        }
        const user = await User.findOne({ email });
        if(!user){
            throw new ErrorHandler(400, 'Invalid Credentials!');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new ErrorHandler(400, 'Invalid Credentials!');
        }
        const payload = {email: user.email};
        const secretKey = process.env.TOKEN_SECRET_KEY as string;
        const token = jwt.sign(payload, secretKey , {
            expiresIn: '1h',
        });
        return res.status(200).json({message: 'Login Sucessful', token})

    } catch(err : any){
        console.error(err);

        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }

        return res.status(500).json({message: 'Server Error!'});
    }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const allUsers = await User.find({});
        if(allUsers.length == 0 || allUsers == undefined){
            throw new ErrorHandler(404, '0 users found!');
        }
        return res.status(200).json({data: allUsers});
    } catch(err: any){

        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }

        return res.status(500).json({message: 'Server Error!'});
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body
    try{
        const theUser = await User.findOne({email: email});
        if(!theUser){
            throw new ErrorHandler(404, 'User not found!');
        }
        await User.deleteOne({email: email});
        return res.status(201).json({message: 'User deleted sucessfully!'});

    } catch(err: any){

        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }
        return res.status(500).json({message: 'Server Error!'});
    }
}

export const registerMissingInfo = async (req: Request, res: Response) => {
    const {token} = req.body;
    try{
        const email = token.email;
        const TheUser = await User.findOne({email})
        
    } catch(err: any){
        
        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }
        return res.status(500).json({message: 'Server Error!'});
    }
}