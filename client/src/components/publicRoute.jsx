import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios_config";
import toast from "react-hot-toast";

function PublicRoute({children}) {
  

  const navigate = useNavigate();


  const fetchUserInfoandCheck = async()=>{
    try {
      const response = await axiosInstance.get('api/users/fetchUserDetails',
        {
          withCredentials:true,
        }
      );

      toast("Logging in ... ",{
        duration:1000,
      });
      if(response?.data?.success) navigate('/');
    } catch (error) {
      console.log(`Sorry oops : ${error}`);
    }

  }

  useEffect(()=>{
    fetchUserInfoandCheck();
},[]);

  return(
    <div>
        {children}
    </div>
  )

}

export default PublicRoute;
