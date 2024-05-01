import { Response } from 'express';
import jwt from 'jsonwebtoken'


const generateTokenAndSetCookies = (user:any,res:Response) => {
    const token = jwt.sign({
        _id:user._id,
    },process.env.JWT_SECRET as string);
    res.cookie('accessToken',token,{
        httpOnly:true,
        expires:new Date(Date.now() + 1000*60*60*24),
        domain:'.vercel.app',path:'/'
    })
}

export default generateTokenAndSetCookies;