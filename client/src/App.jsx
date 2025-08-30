import React, { useContext } from "react";
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import ReruiterLogin from "./components/ReruiterLogin";
import { AppContext } from "./context/AppContext";
import ManageJobs from "./pages/ManageJobs";
import ViewApplication from "./pages/ViewApplication";
import AddJob from "./pages/AddJob";
import Dashboard from "./pages/Dashboard";
import 'quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';


const App = () => {
  const { showReruiterLogin , companyToken } = useContext(AppContext);

  return (
    <div>
      {showReruiterLogin && <ReruiterLogin />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/applications' element={<Applications />} />
        <Route path='/dashboard' element={<Dashboard />}>
            {/* {
             companyToken ? <> */}
              <Route path='add-job' element={<AddJob />} />
              <Route path='manage-job' element={<ManageJobs />} />
              <Route path='view-application' element={<ViewApplication />} />
            {/* </> : null 
            } */}
        </Route>
      </Routes>
    </div>
  );
};

export default App;
