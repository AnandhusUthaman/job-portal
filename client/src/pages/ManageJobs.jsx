import React from "react";
import { manageJobsData } from "../assets/assets";
import moment from 'moment'
import {useNavigate} from 'react-router-dom'


const ManageJobs = () => {
  const navigate = useNavigate()
  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left max-sm:hidden">#</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Job Title</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left max-sm:hidden">Date</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 border-b border-gray-200 text-center ">Applicants</th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">Visibility</th>
            </tr>
          </thead>

          <tbody>
            {manageJobsData.map((job,index)=>(
              <tr key={index} className="text-gray-700"> 
                <td className="py-2 px-4 border-b border-gray-200 text-center max-sm:hidden">{index+1}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-left">{job.title}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-left max-sm:hidden">{moment(job.date).format('ll')}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-left max-sm:hidden">{job.location}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">{job.applicants}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">
                  <input type="checkbox"  className="scale-125 ml-4" />
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={()=>navigate('/dashboard/add-job')} className="bg-blue-500 text-white px-4 py-2 rounded-md">Add new Job</button>
      </div>
    </div>
  );
};

export default ManageJobs;