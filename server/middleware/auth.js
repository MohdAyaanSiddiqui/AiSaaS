import { clerkClient } from "@clerk/express";

export const auth = async (req , res, next) =>{
    try{
        const { userId } = await req.auth();
        req.userId = userId;
        next();
    }catch(error){
        res.json({success: false, message: error.message})
    }
}