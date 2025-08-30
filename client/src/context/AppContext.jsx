import { createContext, useState, useEffect } from "react";
import { jobsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const {user} = useUser()
    const {getToken} = useAuth()



    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    });

    const [isSearched, setIsSearched] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [showReruiterLogin, setShowReruiterLogin] = useState(false);
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

    const [companyToken, setCompanyToken] = useState(null);
    const [companyData, setCompanyData] = useState(null);

    const [userData, setUserData] = useState(null);
    const [userApplications, setUserApplications] = useState([]);



    // function to fetch job data
    const fetchJobs = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/jobs')

            if (data.success) {
                setJobs(data.jobs)
                console.log(data.jobs)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    };


    //function to fetch company data
    const fetchCompanyData = async () => {
        try {
            console.log('Fetching company data with token:', companyToken)
            const {data} = await axios.get(backendUrl + '/api/company/company', {headers: {token: companyToken}})

            console.log('Company data response:', data)

            if(data.success){
                setCompanyData(data.company)
                console.log('Company data set:', data.company)
            }else{
                toast.error(data.message)
                // If company data fetch fails, clear the token
                setCompanyToken(null)
                localStorage.removeItem('companyToken')
            }
        } catch (error) {
            console.error('Error fetching company data:', error)
            toast.error(error.response?.data?.message || error.message)
            // If company data fetch fails, clear the token
            setCompanyToken(null)
            localStorage.removeItem('companyToken')
        }
    }
        

    //function to fetch user data
    const fetchUserData = async () => {
        try {
           const token = await getToken()
           console.log('Fetching user data with token:', token ? 'Token exists' : 'No token')

           const {data} = await axios.get(backendUrl + '/api/user/user', {headers: {Authorization: `Bearer ${token}`}})

           console.log('User data response:', data)

           if (data.success) {
            setUserData(data.user)
            console.log('User data set:', data.user)
           } else {
            console.error('Failed to fetch user data:', data.message)
            toast.error(data.message)
           }

        } catch (error) {
            console.error('Error fetching user data:', error)
            console.error('Error response:', error.response?.data)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // function to fetch user applied applications data 
    const fetchUserApplications = async () => {
        try {
            const token = await getToken()

            const {data} = await axios.get(backendUrl + '/api/user/applications',
                {headers: {Authorization: `Bearer ${token}`}}
            )

            if (data.success) {
                setUserApplications(data.applications)
                console.log(data.applications)
            } else {
                toast.error(data.message)
            }


        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchJobs();

        const storedCompanyToken = localStorage.getItem('companyToken')
        if(storedCompanyToken){
            setCompanyToken(storedCompanyToken)
        }
    }, []);


    useEffect(() => {
        if(companyToken){
            fetchCompanyData()
        }
    }, [companyToken])


    useEffect(()=>{
        if(user){
            fetchUserData()
            fetchUserApplications()
        }
    },[user])


    const value = {
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showReruiterLogin, setShowReruiterLogin,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userData,
        setUserData,
        userApplications,
        setUserApplications,
        fetchUserData,
        fetchUserApplications
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};