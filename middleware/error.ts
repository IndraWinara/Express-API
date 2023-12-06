import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";


export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.status || 500;
    err.message = err.message || 'internal Server Error';

    //error mongodb id dari frontEnd
    if (err.name === 'CastError') {
        const message = `resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400)
    }

    //duplikasi key error dari frontEnd
    if (err.code === 11000) {
        const message = `duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400);
    }

    //JWT error

    
    if (err.name === 'JsonWebTokenError') {
        const message = `Json Web token invalid`
        err = new ErrorHandler(message, 400);
    }

    //Token JWT expired Error
    if (err.name === 'TokenExpiredError') {
        const message = `Json Web token expired error, please try again`
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}