import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/user.model";
import Contact from "../models/contact.model";
import Job from "../models/job.model";


//interface AuthRequest
interface AuthRequest extends Request {
    user? : any
}

//interface job
interface ICreateJob {
    name : string,
    jenis : string,
    jabatan : string,
    owner : string,
    contact_id : string
}

export const createJob = CatchAsyncError(async(req : AuthRequest, res : Response, next : NextFunction)=>{
    try {
        //request body
        const {name,jenis,jabatan} = req.body

        
        //params
        const contactId = req.params.id
        
        //user login
        const userId = req.user
        
        //find user
        const userInfo = await User.findById(userId)

        //find kontak
        const contactInfo = await Contact.findById(contactId)
        
        //payload
        const jobData : ICreateJob = {name,jenis,jabatan,owner : userInfo._id,contact_id : contactId}


        //validasi owner
        if(contactInfo.owner.toString() !== userId.toString() ){
            return res.status(200).json({
                success : false,
                message : 'you are not allowed'
            })
        }

        // create job
        const newJob = await Job.create(jobData)

        //simpan di field job di contact

        await Contact.findByIdAndUpdate(contactId,{
            $push: {jobs : newJob._id}
        })

        return res.status(200).json({
            success : true,
            message : 'Success Add Job'
        })


    } catch (error : any) {
        return next (new ErrorHandler(`Error Create Job : ${error.message}`,400))
    }
})

//interface updateJob

interface IUpdateJob {
    name : string,
    jenis : string,
    jabatan : string,
}


export const updateJob = CatchAsyncError(async(req : AuthRequest, res : Response, next : NextFunction)=>{
    try {
        //req.body
        const {name,jenis,jabatan} = req.body

        // user login
        const user = req.user

        //req.params
        const jobId = req.params.id

        //find job
        const jobInfo = await Job.findById(jobId)

        //validasi Job
        if (user.toString() !== jobInfo.owner.toString()){
            return res.status(400).json({
                success : false,
                message : 'Youre not Allowed'
            })
        }

        //payload
        const jobData : IUpdateJob = {name,jenis,jabatan} 

        //update job
        await Job.findByIdAndUpdate(jobInfo._id,jobData)

        return res.status(200).json({
            success : true,
            message : 'Success Update Job'
        })

    } catch (error :any) {
        return next (new ErrorHandler(`Error Create Job : ${error.message}`,400))
    }
})

export const deleteJob = CatchAsyncError(async(req : AuthRequest,res : Response, next : NextFunction)=>{
    try {
         //ambil user login
         const user = req.user

         //find user
         const userInfo = await User.findById(user)

         // ambil params
         const jobId = req.params.id
 
         //cek apakah ada contact
         const isJobExist = await Job.findById(jobId)
 
         if(!isJobExist){
             return res.status(400).json({
                 success : false,
                 message : `Contact id : ${jobId} not found`
             })
         }
 
         //validasi apakah ini milik sendiri
         if(userInfo._id.toString() !== isJobExist.owner.toString()){
             return res.status(400).json({
                 success : false,
                 message : 'Youre not allow to delete this contact'
             })
         }
 
         // delete contact sesuai id
         await Job.findByIdAndDelete(jobId)


         //update object id di User
         await Contact.findByIdAndUpdate(isJobExist.contact_id,{
             $pull : {jobs : jobId}
         })
 
         return res.status(200).json({
             success : true,
             message : 'Success Delete Job'
         })
    } catch (error : any) {
        return next (new ErrorHandler(`Error Delete Job : ${error.message}`,400))
    }
})


