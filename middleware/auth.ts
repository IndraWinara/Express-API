import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "./CatchAsyncError";
import { verifyToken } from "../services/jwt";
import ErrorHandler from "../utils/ErrorHandler";

interface AuthRequest extends Request {
    user?: any; 
  }

export const authMiddleware = CatchAsyncError(async(req : AuthRequest, res : Response, next : NextFunction)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
   
    if(!token){
        return res.status(400).json({
            success : false,
            message : 'Unauthorized User'
        })
    }

    try {
        const user = verifyToken(token)
        req.user  = user 
        next()
    } catch (error : any) {
        return next(new ErrorHandler(`Error auth middleware : ${error.message}`,500))
    }
    
})