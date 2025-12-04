import {Request, Response, NextFunction} from 'express';
import ErrorHandler from '../middlewares/errorHandler';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      token?: string | JwtPayload;
    }
  }
}

export const MiddlewareAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new ErrorHandler(401, 'Authorization header missing');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new ErrorHandler(400, 'Invalid token format');
    }

    const token = authHeader.replace('Bearer ', '');
    const secretKey: Secret = process.env.TOKEN_SECRET_KEY as string;

    if (!secretKey) {
      throw new ErrorHandler(500, 'Token secret key not configured');
    }

    const decoded = jwt.verify(token, secretKey);
    req.token = decoded;

    next();
  } catch (err: any) {
    if (err instanceof ErrorHandler) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    // Handle JWT errors explicitly
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};
