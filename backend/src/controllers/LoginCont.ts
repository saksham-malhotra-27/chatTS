import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import z from "zod";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import getDataUri from "../services/dataUri";
import cloudinary from 'cloudinary'

const reqLogin = z.object({
    email: z.string().email(),
    password: z.string(),
});

const reqReg = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    status: z.string().optional(),
});

export const Login = async (req: Request, res: Response) => {
    try {
        console.log("Request body:", req.body);

        const result = reqLogin.safeParse(req.body);
        if (!result.success) {
            return res.status(401).json({ message: 'Invalid request body', success:false });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: result.data.email
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isPasswordValid = await bcrypt.compare(result.data.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credentials mismatch", success: false });
        }

        const token = jwt.sign({ email: user.email }, process.env.PRIVATE_KEY!);
        return res.status(200).json({ message: 'User found', success: true, token: token });
    } catch (e) {
        return res.status(500).json({ message: "Server Error", success: false });
    }
};

export const Register = async (req: Request, res: Response) => {
    try {
        const result = reqReg.safeParse(req.body);
        if (!result.success) {
            return res.status(401).json({ message: 'Invalid request body' });
        }

        const hashedPassword = await bcrypt.hash(result.data.password, 10);
        const file = req.file;
        let c;
        if(file){
         const fileUri = getDataUri(file)
         const content = fileUri.content 
         if(content === undefined){
            res.status(404).json({message:'Unexpected error', success: false})
            return 
         }
         const mycloud = await cloudinary.v2.uploader.upload(content)
         c = mycloud;
        }
        const newUser = await prisma.user.create({
            data: {
                name: result.data.name,
                email: result.data.email,
                password: hashedPassword,
                status: result.data.status || '',
                profilePic: c?.secure_url || '',
                profilePicId : c?.public_id || '',
            }
        });


        const token = jwt.sign({ email: newUser.email }, process.env.PRIVATE_KEY!);
        return res.status(201).json({ message: 'User registered', success: true, token: token });
    } catch (e: any) {
        if (e.code === 'P2002') {
            return res.status(409).json({ message: 'Email already in use', success: false });
        }
        return res.status(500).json({ message: "Server Error", success: false });
    }
};
