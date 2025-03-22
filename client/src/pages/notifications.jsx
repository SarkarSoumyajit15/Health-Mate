
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import axiosInstance from "../config/axios_config";
import NotificationDetails from "./notificationDetails.jsx";
import { userActions } from "../store/userState.js";
import UnseenNotification from "../components/unseenNotification.jsx";
import SeenNotification from "../components/seenNotification.jsx";

function Notifications() {
  console.log(" At Notifications");

  const { user ,unseenNotifications,seenNotifications} = useSelector((state) => ({user:state.user.user,unseenNotifications:state.user.unseenNotifications,seenNotifications:state.user.seenNotifications}));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(unseenNotifications)

  const [notifications, setNotifications] = useState([]);

  const [activeTab, setActiveTab] = useState("unseen");

  const [isDetailsPage, setIsDetailsPage] = useState(false);

  const [notificationDetails, setNotificationDetails] = useState({});


  const makeNotificationSeen = async (notification) => {
    try {
      if (!notification) {
        toast.error("Notification is not valid");
        return;
      }
      const response = await axiosInstance.post(
        "/api/users/mark-notification-as-seen",
        {notificationId:notification._id},
        { withCredentials: true }
      );

      if (response?.data?.success) {
        console.log("Notification has been made seen");
      }

      console.log(response?.data?.message);
    } catch (error) {
      toast.error(`Error while making notification seen : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };

  const notificationClickHandler = async (notification) => {
    try {
      const path = notification?.onclickPath;
      const data = notification?.dataToBeSentOnClick;
      const response = await axiosInstance.post(path, data, {
        withCredentials: true,
      });

      if (response?.data?.success) {
        console.log("Doctor Application Details have been fetched");
        setNotificationDetails(response?.data?.doctor);
      }

      setIsDetailsPage(true);

      makeNotificationSeen(notification);
      
      if(notification.isSeen) return;
      dispatch(userActions.setOneNotificationAsSeen({notificationId:notification._id,notification:notification}));
      
      console.log(response?.data?.message);
    } catch (error) {
      toast.error(`Error while fetching doctor application details : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };



  const handleDeleteAllNotifications = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/users/delete-all-notifications",
        {},
        { withCredentials: true }
      );

      if (response?.data?.success) {
        console.log("All Notifications have been deleted");
        dispatch(userActions.unsetAllSeenNotifications());
      }

      console.log(response?.data?.message);
    } catch (error) {
      toast.error(`Error while deleting all notifications : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  }


  const handleDeleteOneNotification = async (notification) => {
    try {
      const response = await axiosInstance.post(
        "/api/users/delete-notification",
        {notificationId:notification._id},
        { withCredentials: true }
      );

      if (response?.data?.success) {
        console.log("Notification has been deleted");
        dispatch(userActions.unsetOneSeenNotification({notificationId:notification._id}));
        window.location.reload();
      }

      console.log(response?.data?.message);
    } catch (error) {
      toast.error(`Error while deleting notification : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  }

  useEffect(
    () => {
      setActiveTab("unseen");
    }
    ,[]);

  return (
    <div className=" flex flex-col items-center max-w-full mx-auto p-4 bg-gray-100 rounded-lg shadow-md min-h-screen">
      <h2 className=" align-middle text-xl font-semibold mb-4">
        Notifications
      </h2>
        <div className="min-w-full">
          <div className="mb-1 mt-2">
            <button
              onClick={() => {
                setActiveTab("unseen");
                // setNotifications(unseenNotifications);
              }}
              className={`px-3 py-1 rounded-t-lg ${
                activeTab === "unseen"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              Unseen
            </button>
            <button
              onClick={() => {
                setActiveTab("seen");
                // setNotifications(seenNotifications);
              }}
              className={`px-3 py-1 rounded-t-lg ${
                activeTab === "seen"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              Seen
            </button>
          </div>
          {activeTab == "unseen" ? (<UnseenNotification/>) : (<SeenNotification/>)}
        </div>
      
    </div>
  );
}

export default Notifications;




/* <div className=" min-h-screen  rounded-lg ">
  {activeTab === "seen" && notifications.length > 0 && <div className="flex justify-end">
    <button
      onClick={() => {
        handleDeleteAllNotifications();
        // window.location.reload();
        // setIsDetailsPage(false);
      }}
      className="m-4 ml-1  px-3 rounded-md bg-gray-300 hover:bg-gray-400 cursor-pointer "
    >
      <i class="ri-delete-bin-6-line"></i>all
    </button>
  </div>}
  <ul className="space-y-2 ">
    {notifications &&
      notifications.map((notification, index) => (
        <div
          className=" min-w-full bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer grid grid-cols-1 md:grid-cols-11 gap-6 p-1"
        >
          <div
            className="p-3 mr-5 hover:bg-gray-100 col-span-10"
           onClick={() => {
            notificationClickHandler(notification);
          }}>{notification?.message}</div>
          {activeTab == "seen" && <div className="p-3 pr-5 mr-5 hover:bg-gray-100 cursor-pointer col-span-1 flex justify-end " onClick={()=>handleDeleteOneNotification(notification)}>
            <i class="ri-delete-bin-4-line"></i>
          </div>}
        </div>
      ))}
  </ul>
</div> */




//  onClick={()=>{
//   console.log("Clicked");
//   setNotificationDetails(true);
// }}

{
  /* <li
  key={index}
  onClick={()=>{
      navigate('/notifications/doctor-application-details');
      setNotificationDetails(true);
  }}
  className="p-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer"
>
  {notification.message}
</li> */
}
