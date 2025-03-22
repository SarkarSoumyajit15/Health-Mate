import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/userState";
import axiosInstance from "../config/axios_config";
import NotificationDetails from "../pages/notificationDetails";
import toast from "react-hot-toast";

function UnseenNotification() {
  const { unseenNotifications } = useSelector((state) => ({
    unseenNotifications: state.user.unseenNotifications,
  }));

  const [isDetailsPage, setIsDetailsPage] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({});
  const [clickedNotification, setClickedNotification] = useState({});

  const dispatch = useDispatch();


  
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
        setClickedNotification(notification);
        setNotificationDetails(response?.data?.dataToBeDisplayed);
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

 

  return (
    <div className=" min-h-screen  rounded-lg ">
      {isDetailsPage ? (
        <NotificationDetails notificationDetails={notificationDetails} setIsDetailsPage={setIsDetailsPage} clickedNotification={clickedNotification}/>
      ) : (
        <div>
          
          <ul className="space-y-2 ">
            {unseenNotifications.length > 0 &&
                unseenNotifications.map((notification, index) => (
                <div className=" min-w-full bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer grid grid-cols-1 md:grid-cols-11 gap-6 p-1">
                  <div
                    className="p-3 mr-5 hover:bg-gray-100 col-span-11"
                    onClick={() => {
                      notificationClickHandler(notification);
                    }}
                  >
                    {notification?.message}
                  </div>
                </div>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UnseenNotification;
