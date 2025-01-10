


import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
// import Loader from "../components/loader";
import Loader from "../components/loader";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios_config";
import { useDispatch, useSelector } from "react-redux";
import { loadingActions } from "../store/loadingState";

export default function SignUpPage() {
  
  const { loading } = useSelector((state) => state.loading);

  const dispatch = useDispatch();
  

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });


  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(true);

  useEffect(() => {
    
    if (
      user.username?.length > 0 &&
      user.email?.length > 0 &&
      user.password?.length > 0
    )
      setButtonDisable(false);
    else setButtonDisable(true);
  }, [user]);

  const handleSubmit = async (event) => {
  
try {
  
      // setLoading(true);
      dispatch(loadingActions.setLoading());
      event.preventDefault();
  
      const response = await axiosInstance.post("/api/users/signup", user);
  
      // setLoading(false);
      dispatch(loadingActions.unsetLoading());

      
  
      // console.log(response.data.success);
      if (response?.data?.success) {
        toast.success(response.data.message);
        toast("redirecting to login page");
        navigate("/login");
      }
      else toast.error(`Sorry oops : ${response.error}`);
} catch (error) {
  toast.error(`Sorry oops : ${error}`);
  // setLoading(false);
  dispatch(loadingActions.unsetLoading());
}
  };

  return (

<div className=" bg-login-bg bg-cover bg-center overflow-hidden ">


    <div className=" flex   justify-center align-middle  text-white font-serif items-center min-h-screen bg-gradient-to-bl from-green-300 to-green-500">
    {loading && <Loader/>}
      
        <div className="flex flex-col justify-center w-80  bg-black rounded-md ">
          <div className="my-5 mx-2 py-2 px-1 flex justify-center">
            <label>
              Username :
              <br />
              <input
                className="text-black"
                type="text"
                value={user.username}
                placeholder="name"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </label>
          </div>

          <div className="my-5 mx-2 py-2 px-1 flex justify-center">
            <label>
              Email :
              <br />
              <input
                className="text-black"
                type="email"
                placeholder="example@gmail.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </label>
          </div>

          <div className="my-5 mx-2 py-2 px-1 flex justify-center">
            <label>
              Password :
              <br />
              <input
                className="text-black"
                type="password"
                value={user.password}
                placeholder="example@123#1"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </label>
          </div>
          <div className="flex justify-center p-1 m-1 align-middle">
            <button

              className={`px-4 py-2 rounded ${
                buttonDisable
                  ? "bg-blue-500 bg-opacity-50 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              } text-white`}
              disabled={buttonDisable}
              onClick={handleSubmit}
            >
              Sign up
            </button>
          </div>

          <Toaster position="top-right" reverseOrder={false} />

          <div className="bg-white flex justify-center text-black flex-col my-2 mx-1 py-3">
            <p className="flex justify-center">
              If You already have an account
            </p>
            <div className="flex justify-center">
              <a
                className="text-blue-500 cursor-pointer hover:underline"
                href="/login"
              >
                {" "}
                Sign In{" "}
              </a>
            </div>
          </div>
        </div>
      
    </div>
</div>
  );
}