import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

interface jwtPayload {
    id: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user: jwtPayload; // add user property to Request interface
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.authToken; // get token from cookies

        if (!token) throw new Error();

    
        const decode = jwt.verify(token, process.env.PASSPORT_SECRET!) as jwtPayload; // verify token and decode payload
        req.user = decode
        next(); // token is valid, proceed to next middleware or route handler
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}