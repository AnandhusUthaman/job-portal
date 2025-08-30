import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import Navbar from '../components/Navbar';
import kconvert from '../utils/kconvert';
import moment from 'moment';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

const ApplyJob = () => {

  const {id} = useParams();

  const {getToken} = useAuth()
  const {user} = useUser()

  const [JobData, setJobData] = useState(null);
 const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)


  const {jobs, backendUrl , userData, setUserData, fetchUserData, fetchUserApplications, userApplications} = useContext(AppContext)
  const navigate = useNavigate()

  const fetchJob = async () => {
    try {
      const {data} = await axios.get(backendUrl +`/api/jobs/${id}`)

      if (data.success) {
       setJobData(data.job)
      } else {
       toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
     


   const applyHandler = async () => {
    try {
      console.log('Apply handler called')
      console.log('userData:', userData)
      console.log('user:', user)
      
      if (!userData) {
        console.log('userData is null, trying to fetch user data...')
        await fetchUserData()
        
        // Check again after fetching
        if (!userData) {
          return toast.error("Please login to apply for this job")
        }
      }

      if (!userData.resume) {
        navigate('/applications')
        return toast.error("Please upload your resume to apply for this job")
      }

      const token = await getToken()
      console.log('Got token:', token ? 'Token exists' : 'No token')

      const {data} =await axios.post(backendUrl + '/api/user/apply', 
        {jobId: JobData._id}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        toast.success(data.message)
        fetchUserApplications()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
        console.error('Error in applyHandler:', error)
        toast.error(error.response?.data?.message || error.message)
    }

   }


   //check if user has already applied for this job
   const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(item => item.jobId._id === JobData._id)
    setIsAlreadyApplied(hasApplied)
   
   }

   
  useEffect(() => {
      fetchJob();
  }, [id,jobs]);

  useEffect(() => {
    if (user && !userData) {
      console.log('User exists but userData is null, fetching user data...')
      fetchUserData()
    }
  }, [user, userData, fetchUserData])

  // Retry fetching user data if it's still null after a delay
  useEffect(() => {
    if (user && !userData) {
      const timer = setTimeout(() => {
        console.log('Retrying user data fetch...')
        fetchUserData()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [user, userData, fetchUserData])

useEffect(() => {
  if (userApplications.length > 0 && JobData) {
    checkAlreadyApplied()
  }
}, [JobData, userApplications, id])


  return JobData ? (
    <>
    <Navbar />
    <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
      <div className='bg-white text-black rounded-lg w-full'>
        <div className='flex justify-center md:justify-between flex-warp gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
          <div className='flex flex-col md:flex-row items-center'>
            <img className='h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border border-gray-200' src={assets.company_icon} alt="" />
            <div className='text-center md:text-left text-neutral-700'>
              <h1 className='text-2xl font-bold  sm:text-4xl font-medium'>{JobData.title}</h1>
              <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>

                <span className='flex items-center gap-1'>
                  <img src={assets.suitcase_icon} alt="" />
                  {JobData.companyId.name}
                </span>

                <span className='flex items-center gap-1'>
                  <img src={assets.location_icon} alt="" />
                  {JobData.location}
                </span>

                <span className='flex items-center gap-1'>
                  <img src={assets.person_icon} alt="" />
                  {JobData.level}
                </span>

                <span className='flex items-center gap-1'>
                  <img src={assets.money_icon} alt="" />
                  CTC:{kconvert.convertTo(JobData.salary)}
                </span>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
            <button  onClick={applyHandler} className='bg-blue-600 text-white px-10 p-2.5 rounded-md'>{isAlreadyApplied?'Already Applied':'Apply Now'}</button>
            <p className='text-gray-600 mt-2'>Posted {moment(JobData.date).fromNow()}</p>
          </div>
          
        </div>

         <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'>
              <h2 className='font-bold text-2xl mb-4'>Job description</h2>
              <div className='rich-text' dangerouslySetInnerHTML={{__html: JobData.description}}></div>
                  <button onClick={applyHandler} className='bg-blue-600 text-white px-10 p-2.5 rounded-md mt-10'>{isAlreadyApplied?'Already Applied':'Apply Now'}</button>
              </div>


              {/* this is the right side of the page  more jobs from the same company*/}
              <div className='w-full lg:w-1/3 lg:mt-0 lg:ml-8 space-y-5'>
                <h2 className='font-bold text-2xl mb-4 mt-4'>More Jobs from {JobData.companyId.name}   </h2>
                {
                  jobs.filter(job => job._id !== JobData._id && job.companyId._id === JobData.companyId._id)
                  .filter(job =>{
                    // set of applied jobIds
                    const appliedJobIds = new Set(userApplications.map(app => app.jobId && app.jobId._id))
                    // return true if the job is not in the appliedJobIds set
                    return !appliedJobIds.has(job._id)
                  }).slice(0,4)
                  .map((job, index) => <JobCard key={index} job={job}/> )
                }
              </div>
         </div>
        
      </div>
    </div>
       <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;