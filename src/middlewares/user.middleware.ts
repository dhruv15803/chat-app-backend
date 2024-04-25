import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

declare global {
    namespace Express {
        interface Request {
            userId?:string;
        }
    }
}

const protectRoute = async (req:Request,res:Response,next:NextFunction) => {
    if(!req.cookies?.accessToken) {
        res.json({
            'success':false,
            "message":"user not logged in",
        })
        return;
    }
    const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET as string) as JwtPayload;
    if(!decodedToken) {
        res.status(500).json({
            "success":false,
            "message":"cannot verify accessToken",
        })
        return;
    }
    const userId:string = decodedToken?._id;
    req.userId = userId;
    next();
}

export {
    protectRoute
}