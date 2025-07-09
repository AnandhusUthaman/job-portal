import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'


const ReruiterLogin = () => {

    const [state, setState] = useState('login')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const [image, setImage] = useState(null)

    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)



    const { setShowReruiterLogin } = useContext(AppContext)





    const onsubmitHandler = async (e) => {
        e.preventDefault()

        if(state === 'Sign Up' && !isTextDataSubmitted){
            // Check if all required fields are filled
            if(name.trim() && email.trim() && password.trim()) {
                setIsTextDataSubmitted(true)
            } else {
                alert('Please fill in all required fields')
            }
        }

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
        }
    }


    useEffect(()=>{
        document.body.style.overflow = 'hidden'
    },[])



    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <form onSubmit={onsubmitHandler} className=' relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>

                {
                state === "Sign Up" && isTextDataSubmitted 
                ?
                    <>
                     <div className='flex items-center gap-4 my-10'>
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <img 
                                className='w-16 h-16 rounded-full object-cover border-2 border-gray-300 hover:border-blue-500 transition-colors' 
                                src={image ? URL.createObjectURL(image) : assets.upload_area} 
                                alt="Company Logo" 
                            />
                            <input 
                                onChange={handleImageChange} 
                                type="file" 
                                hidden 
                                id="image-upload"
                                accept="image/*"
                            />
                        </label>
                        <div>
                            <p className='text-sm font-medium'>Upload Company Logo</p>
                            {/* <p className='text-xs text-gray-500 mt-1'>Click to select image</p> */}
                        </div>
                     </div>
                    
                    </>
                :
                    <>
                    {state !== 'login' && (
                        
                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.person_icon} alt="" />
                        <input className='outline-none text-sm' onChange={e => setName(e.target.value)} value={name}  type="text" placeholder='Company Name ' required />
                    </div>
                    )}




                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.email_icon} alt="" />
                        <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} value={email}  type="email" placeholder='Email Id ' required />
                    </div>

                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                        <img src={assets.lock_icon} alt="" />
                        <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} value={password}  type="password" placeholder='Password ' required />
                    </div>
                    </>
                }

                {state !== 'Sign Up' && <p className='text-sm text-center mt-5'>Forgot Password?</p>}

                <button type='submit' className='bg-blue-600 w-full text-white px-6  py-2 rounded-full mt-5 cursor-pointer'>
                    {state === 'login' ? 'Login' : isTextDataSubmitted ? 'Create Account' : 'Next'}
                </button>

                {
                    state === 'login' 
                    ?
                        <p className='text-center mt-5'>Don't have an account? <span onClick={e => setState('Sign Up')} className='text-blue-600 cursor-pointer'> Sign Up</span></p>
                    
                    :
                        <p className='text-center mt-5'>Already have an account? <span onClick={e => setState('login')} className='text-blue-600 cursor-pointer'> Login</span></p>
                    
                }
                
                <img src= {assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' onClick={() => setShowReruiterLogin(false)} />
            </form>

        </div>
    )
}

export default ReruiterLogin