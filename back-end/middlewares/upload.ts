import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from '../Config/cloudinary';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => ({
        folder: "aquago/images",
        allowed_formats: ["jpg", "png", "jpeg"],
        public_id: `${Date.now()}- ${file.originalname}`,
    }),
});

export const upload = multer({
    storage, 
    limits:{
        fileSize: 5*1024*1024,
    }
})