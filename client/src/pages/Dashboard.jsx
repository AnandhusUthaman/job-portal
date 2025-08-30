import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const {companyData, setCompanyData, setCompanyToken, companyToken} = useContext(AppContext)

  //function to logout company
  const logout = () => {
    setCompanyToken(null)
    localStorage.removeItem('companyToken')
    setCompanyData(null)
    navigate('/')
  }

  useEffect(()=>{
    // Check if user is authenticated
    const storedToken = localStorage.getItem('companyToken')
    if (!storedToken && !companyToken) {
      navigate('/')
      return
    }

    // If we have company data and we're on the main dashboard route, redirect to manage jobs
    if (companyData && location.pathname === '/dashboard') {
      navigate('/dashboard/manage-job')
      setIsLoading(false)
    } else if (companyToken) {
      // If we have token but no company data, wait for it to load
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  },[companyData, companyToken, navigate, location.pathname])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen" >

      {/* Nav bar for recruiter panel   */}
      <div className="shadow py-4">
        <div className="px-5 flex justify-between items-center">
          <img className="max-sm:w-32 cursor-pointer" onClick={() => navigate("/")} src={assets.logo} alt="" />
            {companyData && (
              <div className="flex items-center gap-4">  
                <p className="max-sm:hidden"> Welcome, {companyData.name}  </p>
                <div className="relative group">
                  <img className="w-8 border border-none rounded-full" src={companyData.image} alt="" />
                  <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                    <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm">
                      <li className="py-2 px-3 pr-10 cursor-pointer" onClick={logout}>Logout</li>
                    </ul>
                  </div>
                </div>
              </div> 
            )
          }
        </div>
      </div>

      {/* side bar for recruiter panel */}
      <div className="flex items-start ">
       
       {/* left side bar for options */}

       <div className="inline-block min-h-screen border-r-2">
        <ul className="flex flex-col items-start pt-5 text-gray-800">

          <NavLink className={({isActive})=> `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/add-job'} >
               <img className="min-w-4" src={assets.add_icon} alt="" />
               <p  className="max-sm:hidden">Add Job</p>       
          </NavLink>


          <NavLink className={({isActive})=> `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}  to={'/dashboard/manage-job'} >
               <img className="min-w-4" src={assets.home_icon} alt="" />
               <p className="max-sm:hidden">Manage Job</p>       
          </NavLink>


          <NavLink className={({isActive})=> `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}  to={'/dashboard/view-application'} >
               <img className="min-w-4" src={assets.person_tick_icon} alt="" />
               <p className="max-sm:hidden">View Application</p>       
          </NavLink>

        </ul>
       </div>

        <div className="flex-1 h-full p-2 sm:p-5">
          <Outlet/>
        </div>


      </div>


    </div>
  );
};

export default Dashboard;