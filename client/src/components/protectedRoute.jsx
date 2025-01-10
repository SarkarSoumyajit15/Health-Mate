import React, { Children, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios_config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/userState";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  console.log(" At Protected Route");
  // const {user} = useSelector((state)=>state.user);
  
  const dispatch = useDispatch();


  

  const fetchUserInfoandCheck = async () => {
    try {
      const response = await axiosInstance.get("api/users/fetchUserDetails", {
        withCredentials: true, // Sends cookies along with the request
      });
      // console.log(response)
      if (!response?.data?.success) {
        toast.error("You are not authenticated");
        navigate("/login");
      }
      else{
        dispatch(userActions.setUser({user:response?.data?.user}));
      }
      
    } catch (error) {
      navigate("/login");
      toast("You are not authenticated");
      console.log(`Sorry oops : ${error}`);
    }
  };


  useEffect(() => {


    console.log("at protected route useeffect");
    fetchUserInfoandCheck();
  }, []);

  return <div>{children}</div>;
}

export default ProtectedRoute;
