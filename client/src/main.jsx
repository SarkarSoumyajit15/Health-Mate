import { StrictMode } from 'react'

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import reduxStore from './store/index.js'


import './index.css'


// import Layout from './Layout.jsx'
// import {  createBrowserRouter , RouterProvider } from 'react-router-dom'

// import LoginPage from './pages/login.jsx'
// import SignUpPage from './pages/signup.jsx'
// import Home from './pages/home.jsx'
// import PublicRoute from './components/publicRoute.jsx'
// import { Toaster } from 'react-hot-toast'
// import ProtectedRoute from './components/protectedRoute.jsx'
// import Loader from './components/loader.jsx'


// const router =  createBrowserRouter([
//   { path: "/login", element: <PublicRoute><LoginPage /></PublicRoute> },
//   { path: "/signup", element: <PublicRoute><SignUpPage /></PublicRoute> },
//   { path: "/", element: <ProtectedRoute><Home/></ProtectedRoute> },

// ])



createRoot(document.getElementById('root')).render(

  <>
    
  <Provider store={reduxStore}>
    <App/>
  </Provider>
  </>

)
