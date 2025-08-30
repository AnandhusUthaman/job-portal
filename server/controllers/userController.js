import User from "../models/User.js"    
import JobApplication from "../models/JobApplication.js"
import Job from "../models/Job.js"
import {v2 as cloudinary} from 'cloudinary'

// Get user data
export const getUserData = async (req,res) => {

    const userId = req.auth.userId

    console.log('Getting user data for userId:', userId)

    try {
        let user = await User.findById(userId)

        console.log('Found user:', user ? user._id : 'null')

        if (!user) {
            console.log('User not found in database, creating user...')
            console.log('Available auth data:', req.auth)
            
            // Create user with basic data
            try {
                // Get user data from Clerk if available
                const email = req.auth.email || req.auth.email_addresses?.[0]?.email_address || 'user@example.com'
                const firstName = req.auth.first_name || 'User'
                const lastName = req.auth.last_name || ''
                const name = `${firstName} ${lastName}`.trim() || 'User'
                const image = req.auth.image_url || ''
                
                console.log('Creating user with data:', { userId, email, name, image })
                
                const newUser = await User.create({
                    _id: userId,
                    email: email,
                    name: name,
                    image: image,
                    resume: ''
                })
                user = newUser
                console.log('Created new user:', user._id)
            } catch (createError) {
                console.error('Error creating user:', createError)
                return res.json({success:false, message:'Failed to create user. Please try again.'})
            }
        }

        console.log('Returning user data:', user)
        res.json({success:true, user})

    } catch (error) {
        console.error('Error getting user data:', error)
        res.json({success:false, message:error.message})
    }

}


//Apply for a job
export const applyForJob = async (req,res) => {

    const {jobId} = req.body

    const userId = req.auth.userId
    try {
        
        // Check if user exists
        let user = await User.findById(userId)
        if (!user) {
            console.log('User not found in applyForJob, creating user...')
            
            // Create user with basic data
            try {
                // Get user data from Clerk if available
                const email = req.auth.email || req.auth.email_addresses?.[0]?.email_address || 'user@example.com'
                const firstName = req.auth.first_name || 'User'
                const lastName = req.auth.last_name || ''
                const name = `${firstName} ${lastName}`.trim() || 'User'
                const image = req.auth.image_url || ''
                
                console.log('Creating user in applyForJob with data:', { userId, email, name, image })
                
                const newUser = await User.create({
                    _id: userId,
                    email: email,
                    name: name,
                    image: image,
                    resume: ''
                })
                user = newUser
                console.log('Created new user in applyForJob:', user._id)
            } catch (createError) {
                console.error('Error creating user in applyForJob:', createError)
                return res.json({success:false, message:'User not found and could not be created'})
            }
        }

        const isAlreadyApplied = await JobApplication.findOne({jobId, userId})

        if(isAlreadyApplied){
            return res.json({success:false, message:'You have already applied for this job'})
        }

        const jobData = await Job.findById(jobId)

        if(!jobData){
            return res.json({success:false, message:'Job not found'})
        }

        await JobApplication.create({
            userId,
            jobId,
            companyId:jobData.companyId,
            date:Date.now()
        })
        res.json({success:true, message:'Job application submitted successfully'})

    } catch (error) {
        res.json({success:false, message:error.message})
    }

}


//Get user applied applications
export const getUserJobApplications = async (req,res) => {

    try {
        const userId = req.auth.userId

        // Check if user exists
        let user = await User.findById(userId)
        if (!user) {
            console.log('User not found in getUserJobApplications, creating user...')
            
            // Create user with basic data
            try {
                // Get user data from Clerk if available
                const email = req.auth.email || req.auth.email_addresses?.[0]?.email_address || 'user@example.com'
                const firstName = req.auth.first_name || 'User'
                const lastName = req.auth.last_name || ''
                const name = `${firstName} ${lastName}`.trim() || 'User'
                const image = req.auth.image_url || ''
                
                console.log('Creating user in getUserJobApplications with data:', { userId, email, name, image })
                
                const newUser = await User.create({
                    _id: userId,
                    email: email,
                    name: name,
                    image: image,
                    resume: ''
                })
                user = newUser
                console.log('Created new user in getUserJobApplications:', user._id)
            } catch (createError) {
                console.error('Error creating user in getUserJobApplications:', createError)
                return res.json({success:false, message:'User not found and could not be created'})
            }
        }

        const applications = await JobApplication.find({userId})
        .populate('companyId', 'name email image')
        .populate('jobId', 'title description location category level salary')
        .exec()

        return res.json({success:true, applications})

    } catch (error) {
        res.json({success:false, message:error.message})
    }

}


//update user profile (resume)

export const updateUserResume = async (req,res) => {

   try {
    
     const userId = req.auth.userId

     const resumeFile = req.file

     let userData = await User.findById(userId)

     if (!userData) {
        console.log('User not found in updateUserResume, creating user...')
        
        // Create user with basic data
        try {
            // Get user data from Clerk if available
            const email = req.auth.email || req.auth.email_addresses?.[0]?.email_address || 'user@example.com'
            const firstName = req.auth.first_name || 'User'
            const lastName = req.auth.last_name || ''
            const name = `${firstName} ${lastName}`.trim() || 'User'
            const image = req.auth.image_url || ''
            
            console.log('Creating user in updateUserResume with data:', { userId, email, name, image })
            
            const newUser = await User.create({
                _id: userId,
                email: email,
                name: name,
                image: image,
                resume: ''
            })
            userData = newUser
            console.log('Created new user in updateUserResume:', userData._id)
        } catch (createError) {
            console.error('Error creating user in updateUserResume:', createError)
            return res.json({success:false, message:'User not found and could not be created'})
        }
     }

     if(resumeFile){
        const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)

        userData.resume = resumeUpload.secure_url
     }

     await userData.save()

     return res.json({success:true, message:'Resume uploaded successfully'})
    
   } catch (error) {
        res.json({success:false, message:error.message})
   }

}
