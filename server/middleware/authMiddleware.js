import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import User from '../models/User.js';

export const protectCompany = async (req,res,next) => {
    const token = req.headers.token

   if (!token) {
    return res.json({success:false, message:'Unauthorized, Login Again'})
    
   }
   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
   
    const company = await Company.findById(decoded.id).select('-password')
    
    if (!company) {
      return res.json({success:false, message:'Company not found'})
    }
    
    req.company = company
    
    next()//middleware function
    
   } catch (error) {
      console.error('Auth middleware error:', error)
      res.json({success:false, message:error.message})
   }
  
}

// User authentication middleware for Clerk
export const protectUser = async (req, res, next) => {
    try {
        console.log('protectUser middleware - req.auth:', req.auth);
        console.log('protectUser middleware - req.user:', req.user);
        
        // Check if user is authenticated by Clerk
        if (!req.auth || !req.auth.userId) {
            console.log('No auth or userId found');
            return res.json({ success: false, message: 'Unauthorized, Please login' });
        }

        console.log('User authenticated with ID:', req.auth.userId);

        next();
    } catch (error) {
        console.error('Error in protectUser middleware:', error);
        res.json({ success: false, message: error.message });
    }
};

