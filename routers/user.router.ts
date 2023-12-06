import express from 'express'
import { activationAccount, loginUser, registerUser, userInformation, userUpdate } from '../controllers/user.controller'
import { authMiddleware } from '../middleware/auth'

const userRouter = express.Router()


userRouter.post('/register',registerUser)
userRouter.post('/activation',activationAccount)
userRouter.post('/login',loginUser)
userRouter.get('/me',authMiddleware,userInformation)
userRouter.patch('/update-user',authMiddleware,userUpdate)


export default userRouter