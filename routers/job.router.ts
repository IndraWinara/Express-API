import express from 'express'
import { authMiddleware } from '../middleware/auth'
import { createJob, deleteJob, updateJob } from '../controllers/job.controller'

const jobRouter = express.Router()


jobRouter.post('/create-job/:id',authMiddleware,createJob)
jobRouter.patch('/update-job/:id',authMiddleware,updateJob)
jobRouter.delete('/delete-job/:id',authMiddleware,deleteJob)


export default jobRouter