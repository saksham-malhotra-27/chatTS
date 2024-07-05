import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db/prisma";

export const SignIn = async (req:Request, res: Response, next: NextFunction)=>{
    try{
        const authHeader = req.headers.authorization;
        if(authHeader){
            const token = authHeader;
            jwt.verify(token, process.env.PRIVATE_KEY!, async (err, decoded)=>{
                if(err || !decoded){
                    return res.status(403).json({message:"token not found", success: false})
                }
                const userPayLoad = decoded as JwtPayload
                const email = userPayLoad.email
                const userValid = await prisma.user.findUnique({
                    where:{
                        email: email
                    }, select:{
                        id:            true,
                        name:          true,
                        profilePic:   true,
                        profilePicId: true,
                        status:       true,
                        email:         true, 
                    }
                })
                if(userValid){
                    req.user = userValid;
                    next();
                }
                else{
                    return res.status(401).json({message:"Invalid User", success:false})
                }
            })
            
                
        } else {
            return res.status(401).json({message:"header not found", success: false})
        }
    }
    catch(e){
        res.status(500).json({message:"Server Error", success:false})
    }
}
