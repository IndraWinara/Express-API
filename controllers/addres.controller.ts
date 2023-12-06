import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/CatchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import User from "../models/user.model";
import Contact from "../models/contact.model";
import Addres from "../models/addres.model";



//interface AuthRequest
interface AuthRequest extends Request {
    user? : any
}

//inteface create addres
interface ICreateAddres {
    country : string;
    town : string;
    addreses : string;
    zip_code : string;
    owner : string;
    contact_id : string;
}

export const createAddres = CatchAsyncError(async(req : AuthRequest, res : Response, next : NextFunction)=>{
    try {
        //req body
        const {country,town,addreses,zip_code} = req.body

        //req.user
        const userId = req.user

        //req.params
        const contactId = req.params.id

        //find User
        const userInfo = await User.findById(userId)

        //find contact
        const contactInfo = await Contact.findById(contactId)

        if(!contactInfo){
            return res.status(400).json({
                success : false,
                message : `Contact id : ${contactId} not found`
            })
        }

        // payload data
        const addresData : ICreateAddres = {
            country,town,addreses,zip_code, owner : userInfo._id, contact_id : contactInfo._id
        }

        //validasi owner
        if(userInfo._id.toString() !== contactInfo.owner.toString()){
            return res.status(200).json({
                success : false,
                message : 'Youre not allowed'
            })
        }

        //create address
        const newAddres = await Addres.create(addresData)


        //sava to field address on contact model
        await Contact.findByIdAndUpdate(contactId,{
            $push : {address : newAddres._id }
        })

        return res.status(200).json({
            success : true,
            message : 'Success Create Addres'
        })

    } catch (error : any) {
        return next(new ErrorHandler(`Error Create Addres : ${error.messaage}`,500))
    }
})

//interface update addres
interface IUpdateAddres {
    country : string,
    town : string,
    zip_code : string,
    addreses : string,
}


export const updateAddres = CatchAsyncError(async(req : AuthRequest, res : Response, next : NextFunction)=>{
    try {
        //req body
        const {country,town,zip_code,addreses} = req.body

        // user login
        const userId = req.user

        //req params addres
        const addresId = req.params.id

        //find User
        const userInfo = await User.findById(userId)

        //find address
        const addresInfo = await Addres.findById(addresId)

        //cek address ada atau tidak
        if(!addresInfo) {
            return res.status(400).json({
                success : false,
                message : `Address : ${addresId} not found`
            })
        }

        //validasi owner
        if(userInfo._id.toString() !== addresInfo.owner.toString()){
            return res.status(400).json({
                success : false,
                message : 'Youre not allowed'
            })
        }

        //payload addres
        const addresData : IUpdateAddres = {country,town,zip_code,addreses}

        //update address
        await Addres.findByIdAndUpdate(addresInfo._id,addresData)


        return res.status(200).json({
            success : true,
            message : 'Success Update Addres'
        })
    } catch (error : any) {
        return next(new ErrorHandler(`Error Update Addres : ${error.message}`,500))
    }
})


export const delelteAddres = CatchAsyncError(async (req : AuthRequest, res : Response, next : NextFunction)=>{
    try {
        //user login
        const userId = req.user

        //params addres
        const addresId = req.params.id

        //find user
        const userInfo = await User.findById(userId)

        // find addres
        const addresInfo = await Addres.findById(addresId)

        //cek addrres ada atau tidak di database
        if(!addresInfo){
            return res.status(200).json({
                success : false,
                message : `Address : ${addresId} not found`
            })
        }

        // validasi owner
        if(userInfo._id.toString() !== addresInfo.owner.toString()){
            return res.status(401).json({
                success : false,
                message : 'Youre not allowed'
            })
        }

        //delete addrress
        await Addres.findByIdAndDelete(addresInfo._id)

        //update di database setelah delete di field contact
        await Contact.findByIdAndUpdate(addresInfo.contact_id,{
            $pull : {address : addresInfo._id}
        })

        return res.status(200).json({
            success : true,
            message : 'Success Delete Addres'
        })
    } catch (error : any) {
        return next(new ErrorHandler(`Error Delete Addres : ${error.message}`,500))
    }
})