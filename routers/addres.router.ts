import express from 'express'
import { authMiddleware } from '../middleware/auth'
import { createAddres, delelteAddres, updateAddres } from '../controllers/addres.controller'


const addresRouter = express.Router()

addresRouter.post('/create-addres/:id',authMiddleware,createAddres)
addresRouter.patch('/update-addres/:id',authMiddleware,updateAddres)
addresRouter.delete('/delete-addres/:id',authMiddleware,delelteAddres)




export default addresRouter