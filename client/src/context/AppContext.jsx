import { createContext, useState, useEffect } from "react";
import { jobsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    });

    const [isSearched, setIsSearched] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [showReruiterLogin, setShowReruiterLogin] = useState(false);
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

    // function to fetch job data
    const fetchJobs = async () => {
        setJobs(jobsData);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const value = {
        setSearchFilter, searchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showReruiterLogin, setShowReruiterLogin,
        showRecruiterLogin, setShowRecruiterLogin,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};