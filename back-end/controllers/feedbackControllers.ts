import {Request, Response, NextFunction} from 'express';
import Feedback from '../models/feedback';
import ErrorHandler from '../middlewares/errorHandler';
import jwt from 'jsonwebtoken';

interface AuthTokenPayload {
    email: string;
}

export const registerFeedback = async (req: Request, res: Response, next: NextFunction) => {
    const {rating, comment} = req.body;
    const {user_email, waterPoint_id} = req.params;
    try{
        if(!comment){
            throw new ErrorHandler(400, 'Please write a comment!');
        }
        if(!rating){
            throw new ErrorHandler(400, 'Please rate the point!');
        }
        const newFeedback = new Feedback({
            user_email,
            point_id: waterPoint_id,
            rating, 
            comment
        });
        await newFeedback.save()
        return res.status(201).json({message: 'New feedback registered!'})
    } catch(err: any){

        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }

        return res.status(err.statusCode || 500).json({ message: err.message || 'Server error!' });

    }
}

export const ListOfAllFeedbacks = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const AllFeedback = await Feedback.find();
        if(!AllFeedback){
            throw new ErrorHandler(404, 'Zero feedback found!')
        }
        return res.status(200).json({data: AllFeedback})
    } catch(err: any){

        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }

        return res.status(err.statusCode || 500).json({ message: err.message || 'Server error!' });

    }
};

export const feedbackByWaterPoints = async (req: Request, res: Response, next: NextFunction) => {
    const {waterPoint_id} = req.params
    try{
        const FeedbackByPoint = await Feedback.find({ 
            point_id : waterPoint_id,
        })
        if(!FeedbackByPoint){
            throw new ErrorHandler(404, 'Zero feedback on this point found!');
        };
        return res.status(200).json({data: FeedbackByPoint})
    } catch(err: any){

        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }

        return res.status(err.statusCode || 500).json({ message: err.message || 'Server error!' });

    }
}

export const deleteComment = async (req: Request, res: Response) => {
    const {point_id} = req.params;
    const authHeader = req.header('Authorization') as string;
    const token = authHeader.replace('Bearer ', '');
    const secretKey = process.env.TOKEN_SECRET_KEY as string;
    const decoded = jwt.verify(token, secretKey) as AuthTokenPayload
    try{
        const feedbackToDelete = await Feedback.findOne({
            user_email : decoded.email,
            point_id
        })
        if(!feedbackToDelete){
            throw new ErrorHandler(404, `The comment was not found!`)
        }
        await Feedback.deleteOne({user_email: decoded.email, point_id});
        res.status(201).json({message: `This comment from ${decoded.email} was deleted!`})
        
    } catch(err: any){

         if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }

        return res.status(err.statusCode || 500).json({ message: err.message || 'Server error!' });

    }

}