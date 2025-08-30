import express from 'express'
import { getUserData, applyForJob, getUserJobApplications, updateUserResume } from '../controllers/userController.js'
import upload from '../config/multer.js'
import { protectUser } from '../middleware/authMiddleware.js'


const router = express.Router()

//get user data
router.get('/user', protectUser, getUserData)

//apply for a job   
router.post('/apply', protectUser, applyForJob)

//get user applied applications
router.get('/applications', protectUser, getUserJobApplications)

//update user resume
router.post('/update-resume', protectUser, upload.single('resume'), updateUserResume)

//test endpoint to check auth data
router.get('/test-auth', protectUser, (req, res) => {
    console.log('Test auth endpoint - req.auth:', req.auth)
    res.json({ success: true, auth: req.auth })
})

export default router;