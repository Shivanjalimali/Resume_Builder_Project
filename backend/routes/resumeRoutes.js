import express, { Router } from 'express'
import {protect} from '../middleware/authMiddleware.js'
import { createResume, deleteResume, getResumeById, getUserResumes, updateResume } from '../controllers/resumeController.js';
import { uploadResumeImages } from '../controllers/uploadImages.js';

const resumeRouter=express.Router();

resumeRouter.post('/',protect,createResume)
resumeRouter.get('/',protect,getUserResumes)
resumeRouter.get('/:id',protect,getResumeById)

resumeRouter.put('/:id',protect,updateResume);
resumeRouter.put('/:id/upload-images',protect,uploadResumeImages)
resumeRouter.delete('/:id',protect,deleteResume)

export default resumeRouter;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OGIzYmJkY2EwMzQwYThiY2Y3MDhmNyIsImlhdCI6MTc3MDc4MDgzMCwiZXhwIjoxNzcxMzg1NjMwfQ.hO0t4AZctdTuwzIoSR_fIPgAxlxtMPXMBvcpMiz29sI