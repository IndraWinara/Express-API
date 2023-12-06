import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import Contact from "../models/contact.model";
import User from "../models/user.model";


//interface create contact

interface ICreateContact {
    name : string,
    email : string,
    phone : string,
    address : string,
    owner : string
}

//interface request user

interface AuthRequest extends Request {
    user? : any
}

export const createContact = CatchAsyncError(async(req : AuthRequest, res : Response, next : NextFunction)=>{
    try {
        const {name,email,phone,address,owner} = req.body

        //ambil user login dari middleware
        const user = req.user

        //find user
        const userInfo = await User.findById(user)

        //validasi user 
        if(!userInfo){
            return res.status(400).json({
                success : false,
                message : 'Youre not allowed'
            })
        }


        //payload data
        const contactData : ICreateContact = {
            name,email,phone,address,owner : user
        }

        //create contact
        const newContact = await Contact.create(contactData)

        //simpan di User
        await User.findByIdAndUpdate(user,{
            $push : {contact : newContact._id}
        })

        return res.status(200).json({
            success : true,
            message : 'Success Create Contact'
        })
        
    } catch (error : any) {
        return next(new ErrorHandler(`Error Create Contact : ${error.message}`,400))
    }
})


//interface update contact

interface IUpdateContact {
    name : string,
    email : string,
    phone : string,
    address : string,
}

export const updateContact = CatchAsyncError(async (req : AuthRequest, res : Response, next : NextFunction)=>{
    try {
        const {name,email,phone,address} = req.body
        const contactId = req.params.id
        
        //user dari login
        const user = req.user

        //find user
        const userInfo = await User.findById(user)
        //payload
        const updateData : IUpdateContact = {name,email,phone,address}

        //check kontak milik sendiri
        const contactInfo = await Contact.findById(contactId)

        if(userInfo._id.toString() !== contactInfo.owner.toString()){
            return res.status(401).json({
                success : false,
                message : 'Youre not allowed to update this contact'
            })
        }

        //update contact
        await Contact.findByIdAndUpdate(contactInfo._id,updateData)

        return res.status(201).json({
            success : true,
            message : 'Success Update Contact'
        })
    } catch (error : any) {
        return next(new ErrorHandler(`Error Update Contact : ${error.message}`,400))
    }
})


export const deleteContact = CatchAsyncError(async(req : AuthRequest, res : Response, next : NextFunction)=>{
    try {
        //ambil user login
        const user = req.user

        //find user
        const userInfo = await User.findById(user)

        // ambil params
        const contactId = req.params.id

        //cek apakah ada contact
        const isContactExist = await Contact.findById(contactId)

        if(!isContactExist){
            return res.status(400).json({
                success : false,
                message : `Contact id : ${contactId} not found`
            })
        }

        //validasi apakah ini milik sendiri
        if(userInfo._id.toString() !== isContactExist.owner.toString()){
            return res.status(400).json({
                success : false,
                message : 'Youre not allow to delete this contact'
            })
        }

        // delete contact sesuai id
        await Contact.findByIdAndDelete(contactId)

        //update object id di User
        await User.findByIdAndUpdate(userInfo,{
            $pull : {contact : contactId}
        })

        return res.status(200).json({
            success : true,
            message : 'Success Delete Contact'
        })

    } catch (error : any) {
        return next (new ErrorHandler(`Error Delete Contact : ${error.message}`,400))
    }
})