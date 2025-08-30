import React, { use, useContext, useEffect, useRef, useState } from "react";
//import ReactQuill from "react-quill";
import 'quill/dist/quill.snow.css';
import Quill from "quill";
import { JobCategories,  JobLocations } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const AddJob = () => {

  const [title, setTitle] = useState('');;
  const [location, setLocation] = useState('kochi');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState('Beginner');
  const [salary, setSalary] = useState(0);


  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const {backendUrl, companyToken} = useContext(AppContext)
  const navigate = useNavigate()

  // Test authentication
  const testAuth = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/company/test-auth', {
        headers: {token: companyToken}
      })
      console.log('Auth test response:', data)
    } catch (error) {
      console.error('Auth test error:', error)
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
          try {
                console.log('Submitting job with token:', companyToken)
                console.log('Form data:', { title, location, category, level, salary })

                const description = quillRef.current.root.innerHTML
                console.log('Description:', description)

                const  {data} = await axios.post(backendUrl + '/api/company/post-job', {
                  title,
                  location,
                  category,
                  level,
                  salary,
                  description
                }, {headers: {token: companyToken}}
              )

              console.log('Response:', data)

              if (data.success) {
                toast.success(data.message)
                setTitle('')
                setSalary(0)
                quillRef.current.root.innerHTML = ""
                navigate('/dashboard/manage-job')
              } else{
                toast.error(data.message)
              }

          } catch (error) {
                console.error('Error submitting job:', error)
                toast.error(error.response?.data?.message || error.message)
          }
   }

  useEffect(() => { 
    // initialize quill only once 
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
    
    // Test authentication on component mount
    if (companyToken) {
      testAuth()
    }
  },[companyToken])

  return (

    <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col gap-4 w-full items-start ">
           <div className="w-full">
              <p className="mb-2">Job Title</p>
              <input type="text" placeholder="Enter Job Title" 
              onChange={(e) => setTitle(e.target.value)}  value={title}
              required
              className="w-full max-w-lg px-3 py-2 border border-gray-300 rounded" />

           </div>

           <div className="w-full max-w-lg">
               <p className="my-2">Job Description</p>
               <div ref={editorRef} className="border border-gray-300 rounded">
               </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-6 w-full sm:gap-8"> 

               <div>
                  <p className="mb-2">Job Category</p>
                  <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setCategory(e.target.value)} value={category} required>
                    {JobCategories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
               </div>
              

               <div>
                  <p className="mb-2">Job Location </p>
                  <select  className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setLocation(e.target.value)} value={location} required>
                    {JobLocations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
               </div>
              
               <div>
                  <p className="mb-2">Job Level</p>
                  <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setLevel(e.target.value)} value={level} required>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
               </div>
              
           </div>

           <div>
                  <p className="mb-2">Salary</p>
                  <input min={0} type="number" placeholder="25000" 
                  onChange={(e) => setSalary(e.target.value)}  value={salary}
                  required 
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"/>
           </div>

         <button className="w-28 py-3 mt-4 bg-blue-500 text-white rounded cursor-pointer" type="submit">Add Job</button>
    </form>
 
  );
};

export default AddJob;      