import express from 'express'
import { authMiddleware } from '../middleware/auth'
import { createContact, deleteContact, updateContact } from '../controllers/contact.controller'


const contactRouter = express.Router()


contactRouter.post('/create-contact',authMiddleware,createContact)
contactRouter.patch('/update-contact/:id',authMiddleware,updateContact)
contactRouter.delete('/delete-contact/:id',authMiddleware,deleteContact)



export default contactRouter