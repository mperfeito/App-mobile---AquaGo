import {Request, Response, NextFunction} from 'express';
import waterPoint from '../models/waterPoint';
import ErrorHandler from '../middlewares/errorHandler';


export let registerWaterPoint = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {name, type, status, coordinates, opening_hours, last_maintenance_date} = req.body;

        if(!name || !coordinates){
            throw new ErrorHandler(400, 'Please fill all the fields!');
        }
        const pointExist = await waterPoint.findOne({coordinates});
        if(pointExist){
            throw new ErrorHandler(400, 'This water point already exists!');
        } 
        const newPoint = new waterPoint({name, type, status, coordinates, opening_hours, last_maintenance_date});
        await newPoint.save();
        return res.status(201).json({message: 'New water point registered sucessfuly', data: newPoint});

    } catch(err: any){

        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }

        return res.status(500).json({message: 'Server error!'});
    }
}

export let deleteWaterPoint = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const _id = req.params.id;
        const pointExist = await waterPoint.findOne({_id});
        if(!pointExist){
            throw new ErrorHandler(400, 'The water point does not exist!');
        }
        await waterPoint.deleteOne({_id});
        return res.status(201).json({message: 'Water point deleted sucessfully!'})
    } catch(err: any){

        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }

        return res.status(500).json({message: 'Server Error!'});
    }
}

export let listAllWaterPoints = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const getAllWaterPoints = await waterPoint.find();
        if(getAllWaterPoints.length == 0 || getAllWaterPoints == undefined){
            throw new ErrorHandler(404, 'There are zero water Points saved!');
        }
        return res.status(200).json({data: getAllWaterPoints})
    } catch(err: any){

        if (err instanceof ErrorHandler) {
        return res.status(err.statusCode).json({ message: err.message });
        }

        return res.status(500).json({message: 'Server error!'})
    }
}