import express from 'express'
import { registerCompany, loginCompany, getCompanyData, postJob, getCompanyJobApplicants, getCompanyPostedJobs, changeVisibilty, ChangeJobApplicationStatus } from '../controllers/CompanyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

const router = express.Router()

// Register a company 
router.post('/register', upload.single('image'), registerCompany)

// company login 
router.post('/login',loginCompany)

// get company data 
router.get('/company',protectCompany,getCompanyData)

//Post a job
router.post('/post-job',protectCompany,postJob)

//get company job applicants
router.get('/applicants',protectCompany,getCompanyJobApplicants)

//get company posted jobs list 
router.get('/list-jobs',protectCompany,getCompanyPostedJobs)

//change job application status
router.post('/change-status',protectCompany,ChangeJobApplicationStatus)

//change job visibility
router.post('/change-visibility',protectCompany,changeVisibilty)

//test endpoint to check authentication
router.get('/test-auth',protectCompany,(req,res) => {
    res.json({success:true, message:'Authentication working', company: req.company})
})



export default router
