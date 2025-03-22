
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios_config";
import Loader from "../components/loader";
import { useDispatch, useSelector } from "react-redux";
import { loadingActions } from "../store/loadingState";

export default function LoginPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // const [loading, setLoading] = useState(false);
  const {loading} = useSelector((state)=>state.loading);
  const dispatch =  useDispatch();
  const [buttonDisable, setButtonDisable] = useState(true);

  useEffect(() => {
    if (user.email?.length > 0 && user.password?.length > 0)
      setButtonDisable(false);
    else setButtonDisable(true);
  }, [user]);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      dispatch(loadingActions.setLoading());
  
      if (user.email?.length == 0 || user.password?.length == 0) toast.error;
  
      const response = await axiosInstance.post("/api/users/login", user,
        {
          withCredentials : true,
        }
      );
      
      // console.log(response);
      dispatch(loadingActions.unsetLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("redirecting to Home page");
        console.log("finally i am going");
        navigate("/");

      }
      else toast.error(`Sorry oops : ${response.data.error}`);
      
    } catch (error) {
      console.log(error);
      toast.error(`Sorry oops : ${error}`);
      dispatch(loadingActions.unsetLoading());
    }
  }
// "D:\Soumyajit Sarkar\medical_background_image.jpg"
  return (
<div className=" bg-login-bg bg-cover bg-center overflow-hidden ">

      <div className=" flex justify-center items-center text-white font-serif min-h-screen relative left-72  ">
    {loading && <Loader/>}
        
        <div className="flex flex-col justify-center w-80  bg-black rounded-md items-center pb-8 pt-5">
          <form>
          <div className="my-5 mx-2 py-2 px-1 flex justify-center">
            <label>
              Email :
              <br />
              <input
                className="text-black"
                type="email"
                placeholder="example@gmail.com"
                value={user.email}
                autoComplete="user-email"
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
                autoComplete="current-password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </label>
          </div>

          </form>
          <div className="flex justify-center p-1 m-1 align-middle">
            <button
              // className="bg-blue-500 p-1 m-1 rounded-md hover:bg-blue-600 "
              className={`px-4 py-2 rounded ${
                buttonDisable
                  ? "bg-blue-500 bg-opacity-50 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              } text-white`}
              disabled={buttonDisable}
              onClick={handleSubmit}
            >
              Log in
            </button>
          </div>
          <div className="flex justify-center">
              <a
                className="text-blue-500 cursor-pointer hover:underline"
                href="/signup"
              >
                {" "}
                Signup{" "}
              </a>
          </div>
        </div>
        
      </div>
</div>
  );
}
