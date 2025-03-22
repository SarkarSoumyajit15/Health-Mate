import React from 'react';
import Loader from './components/loader.jsx'
import { useSelector } from 'react-redux';



import Layout from './Layout.jsx'
import {  createBrowserRouter , RouterProvider } from 'react-router-dom'

import LoginPage from './pages/login.jsx'
import SignUpPage from './pages/signup.jsx'
import Home from './pages/home.jsx'
import PublicRoute from './components/publicRoute.jsx'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/protectedRoute.jsx'
import Appointment from './pages/appointment.jsx';
import ApplyDoctor from './pages/applyDoctor.jsx';
import Card from './components/profileCard.jsx';
import Notifications from './pages/notifications.jsx';
import Doctor from './components/doctor.jsx';
import TestDoctor from './components/testDoctor.jsx';
import UserAppointmentHistory from './pages/userAppointmentHistory.jsx';
import Testpg from './pages/testpg.jsx';
import DoctorAppointmentHistory from './pages/doctorAppointmentHistory.jsx';
import EditDoctorInfo from './pages/editDoctorInfo.jsx';

// import Loader from './components/loader.jsx'




function App(){


  const router =  createBrowserRouter([
    
    { path: "/testpg", element: <PublicRoute><Testpg /></PublicRoute> },
    { path: "/login", element: <PublicRoute><LoginPage /></PublicRoute> },
    { path: "/signup", element: <PublicRoute><SignUpPage /></PublicRoute> },
    { path: "/", 
      element: <ProtectedRoute><Layout><Home/></Layout></ProtectedRoute>,
      children:[
        { path : "/doctor/:doctorId" , element:<TestDoctor/>},
      ]
  
     },
    { path:'/appointments', element:<ProtectedRoute><Layout><Appointment/></Layout></ProtectedRoute>},
    { path:'/user-appointment-history', element:<ProtectedRoute><Layout><UserAppointmentHistory/></Layout></ProtectedRoute>},
    { path:'/doctor-appointment-history', element:<ProtectedRoute><Layout><DoctorAppointmentHistory/></Layout></ProtectedRoute>},
    { path:'/apply-doctor', element:<ProtectedRoute><Layout><ApplyDoctor/></Layout></ProtectedRoute>},
    { path:'/edit-doctor-info', element:<ProtectedRoute><Layout><EditDoctorInfo/></Layout></ProtectedRoute>},
    { 
      path:'/notifications', 
      element:<ProtectedRoute><Layout><Notifications/></Layout></ProtectedRoute>,
      children:[
      ]
    },
    { path : '/profilecard' , element:<ProtectedRoute><Card/></ProtectedRoute>}
  
  ]);

  // const {loading} = useSelector((state)=>state.loading);


  
  return(
<div className='min-h-screen'>
    <RouterProvider router = {router}/>
    {/* {loading && <Loader/>} */}
    <Toaster position="top-right" reverseOrder={false} />
</div>
  
)
}


export default App;