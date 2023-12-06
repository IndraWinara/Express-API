import express, { NextFunction, Request, Response } from 'express'
import { ErrorMiddleware } from './middleware/error'
import userRouter from './routers/user.router'
import rateLimit from 'express-rate-limit'
import contactRouter from './routers/contact.router'
import jobRouter from './routers/job.router'
import addresRouter from './routers/addres.router'
import cors from 'cors'


export const app = express()

//untuk request dengan json
app.use(express.json({limit : '50mb'}))

//cors
app.use(cors())


//cek api
app.get('/testing',(req : Request, res: Response, next : NextFunction)=>{
    return res.status(200).json({
        success : true,
        message : 'test api success'
    })
})

//router
app.use('/api/v1',userRouter)
app.use('/api/v1',contactRouter)
app.use('/api/v1',jobRouter)
app.use('/api/v1',addresRouter)

//route not found
app.all('*',(req : Request, res : Response, next : NextFunction)=>{
    return res.status(400).json({
        success : false,
        message : `route ${req.originalUrl} not found`
    })
})

//middleware
app.use(ErrorMiddleware)