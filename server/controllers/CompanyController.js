import Company from "../models/Company.js"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import generateToken from '../utils/generateToken.js'
import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"

// Register a new company 
export const registerCompany =  async (req,res) => {
    const {name,email,image,password} = req.body
    
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({success:false, message:"All fields are required"})
    }

    try {

         const companyExists = await Company.findOne({email})      
         if (companyExists) {
            return res.json({success:false, message:"Company already exists"})
         }

         const salt = await bcrypt.genSalt(10)
         const hashedPassword = await bcrypt.hash(password,salt)

         const imageUpload = await cloudinary.uploader.upload(imageFile.path)

         const company = await Company.create({
            name,
            email,
            image:imageUpload.secure_url,
            password:hashedPassword
         })

         res.json({
            success:true,
           company:{
            _id:company._id,
            name:company.name,
            email:company.email,
            image:company.image
           },
           token:generateToken(company._id)
        })


    } catch (error) {
        res.json({success:false, message:error.message})
    }
    
}

// Company login
export const loginCompany = async (req,res) => {
    
    const { email, password} = req.body

    try {
        
        const company = await Company.findOne({email})
        if (await bcrypt.compare(password, company.password)) {

            res.json({
                success:true,
                company:{
                    _id:company._id,
                    name:company.name,
                    email:company.email,
                    image:company.image
                },
                token: generateToken(company._id)
            })
        }
        else{
            res.json({success:false, message:'invalid email or password'})
        }
        
    } catch (error) {
            res.json({success:false, message: error.message })
        
    }
}

//Get company data 
export const getCompanyData = async (req,res) => {

    try {
        
        const company = req.company

        res.json({success:true, company})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// Post a new job 
export const postJob = async (req,res) => {

    const {title,description,location,salary,level,category} = req.body

    const companyId = req.company._id

    console.log('Posting job with companyId:', companyId)
    console.log('Job data:', {title,description,location,salary,level,category})

    try {
        // Validate required fields
        if (!title || !description || !location || !salary || !level || !category) {
            return res.json({success:false, message:'All fields are required'})
        }

        const newJob = new Job({
            title,
            description,
            location,
            salary: Number(salary),
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJob.save()

        console.log('Job saved successfully:', newJob._id)

        res.json({success:true, message:'Job posted successfully'})

    } catch (error) {
        console.error('Error posting job:', error)
        res.json({success:false, message:error.message})
    }
    
}

// Get company job applicants
export const getCompanyJobApplicants = async (req,res) => {

    try {
        
        const companyId = req.company._id

        console.log('Fetching applicants for companyId:', companyId)

        // Find Job applications for the company and populate related data 
        const applications =  await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec()

        console.log('Found applications:', applications.length)

        return res.json({success:true, applications})

    } catch (error) {
        console.error('Error fetching company applicants:', error)
        res.json({success:false, message:error.message})
        
    }
    
}

//Get Company posted Job 
export const getCompanyPostedJobs = async (req,res) => {
    
    try {
        
        const companyId = req.company._id

        const jobs = await Job.find({companyId})

        // Adding no. of applicants to each job
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({jobId:job._id});
            return{...job.toObject(), applicants:applicants.length}
         })) 

        res.json({success:true, jobsData})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//Change Job Application status
export const ChangeJobApplicationStatus = async (req,res) => {
    try {
        const {id, status} = req.body

        // Validate status
        if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
            return res.json({success:false, message:'Invalid status'})
        }

        // Find Job application data and update status
        await JobApplication.findByIdAndUpdate({_id:id}, {status}, {new:true})
    
        res.json({success:true, message:'Application status updated'})

    } catch (error) {
        console.error('Error updating application status:', error)
        res.json({success:false, message:error.message})
    }

  
  
}

// change job visibility 
export const changeVisibilty = async (req,res) => {
    try {
        
        const {id} = req.body

        const companyId = req.company._id

        const job = await Job.findById(id)

        if (!job) {
            return res.json({success:false, message:'Job not found'})
        }

        if (companyId.toString() === job.companyId.toString()) {
           job.visible = !job.visible
           await job.save()
           res.json({success:true, job})
        } else {
            res.json({success:false, message:'Unauthorized to modify this job'})
        }

    } catch (error) {
        console.error('Error changing job visibility:', error)
        res.json({success:false, message:error.message})
    }
}