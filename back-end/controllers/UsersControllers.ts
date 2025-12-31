import {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import User from '../models/usersModel';
import ErrorHandler from '../middlewares/errorHandler';
import jwt from 'jsonwebtoken';
require('dotenv').config();

interface AuthTokenPayload {
    email: string;
}

export const registerUser = async (req : Request, res: Response) => {
    try{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ErrorHandler(400, 'Email already registered');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();
        const payload = {email: email};
        const secretKey = process.env.TOKEN_SECRET_KEY as string;
        const token = jwt.sign(payload, secretKey , {
            expiresIn: '1h',
        });
        return res.status(201).json({ message: 'User registered successfully', token});

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
    const {age, phone_number, gender, activity_level, climate_type, height, weight} = req.body
    const authHeader = req.header('Authorization') as string;
    const token = authHeader.replace('Bearer ', '');
    const secretKey = process.env.TOKEN_SECRET_KEY as string;
    const decoded = jwt.verify(token, secretKey) as AuthTokenPayload
    try{
        const email = decoded.email;
        const TheUser = await User.findOne({email})
        if(!TheUser){
            throw new ErrorHandler(404, 'User not found!');
        }
        TheUser.age = age;
        TheUser.phone_number = phone_number;
        TheUser.gender = gender;
        TheUser.activity_level = activity_level;
        TheUser.climate_type = climate_type;
        TheUser.height = height;
        TheUser.weight = weight;
        await TheUser.save()
        res.status(201).json({message: "New infomations saved!!"});
        
    } catch(err: any){
        
        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }
        return res.status(500).json({message: 'Server Error!'});
    }
}

export let getTheUserLoggedInInfo = async ( req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization') as string;
    const token = authHeader.replace('Bearer ', '');
    const secretKey = process.env.TOKEN_SECRET_KEY as string;
    const decoded = jwt.verify(token, secretKey) as AuthTokenPayload
    try{    
        const email = decoded.email;
        const TheUser = await User.findOne({email})
        if(!TheUser){
            throw new ErrorHandler(404, 'User not found!');
        }
        res.status(200).json({data: TheUser})
    } catch(err: any){
        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }
        return res.status(500).json({message: 'Server Error!'});
    }
}