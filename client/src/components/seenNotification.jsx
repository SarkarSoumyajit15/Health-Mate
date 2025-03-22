import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../store/userState";
import axiosInstance from "../config/axios_config";
import NotificationDetails from "../pages/notificationDetails";
import toast from "react-hot-toast";
import { deleteAllNotifications, deleteOneNotification} from "../../utils/Notifications/deleteNotification";

function SeenNotification() {
  const { seenNotifications } = useSelector((state) => ({
    seenNotifications: state.user.seenNotifications,
  }));

  const [clickedNotification, setClickedNotification] = useState({});

  const [isDetailsPage, setIsDetailsPage] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({});

  const dispatch = useDispatch();

  const notificationClickHandler = async (notification) => {
    try {
      const path = notification?.onclickPath;
      const data = notification?.dataToBeSentOnClick;
      const response = await axiosInstance.post(path, data, {
        withCredentials: true,
      });

      if (response?.data?.success) {
        console.log("Doctor Application Details have been fetched");
        setNotificationDetails(response?.data?.dataToBeDisplayed);
        setClickedNotification(notification);
      }

      setIsDetailsPage(true);

      console.log(response?.data?.message);
    } catch (error) {
      toast.error(`Error while fetching doctor application details : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {

      let noti =  seenNotifications.find((notification)=>notification?.type === 'action');
      if(noti){
        toast("You can't delete all notifications [ Some action needs to be performed ]");
        return;
      }
      
      const response = await deleteAllNotifications();

      if (response?.data?.success) {
        console.log("All Notifications have been deleted");
        dispatch(userActions.unsetAllSeenNotifications());
      }

      console.log(response?.data?.message);
    } catch (error) {
      toast.error(`Error while deleting all notifications : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };

  const handleDeleteOneNotification = async (notification) => {
    try {

      if(notification?.type === 'action'){
        toast("You can't delete this notification [ Some action needs to be performed ]");
        return;
      }
      const response = await deleteOneNotification(notification);

      if (response?.data?.success) {
        console.log("Notification has been deleted");
        dispatch(
          userActions.unsetOneSeenNotification({
            notificationId: notification._id,
          })
        );
      }

      console.log(response?.data?.message);
    } catch (error) {
      toast.error(`Error while deleting notification : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };

  return (
    <div className=" min-h-screen  rounded-lg ">
      {isDetailsPage ? (
        <NotificationDetails notificationDetails={notificationDetails} setIsDetailsPage={setIsDetailsPage} clickedNotification = {clickedNotification}/>
      ) : (
        <div>
          {seenNotifications.length > 0 && (
            <div className="flex justify-end">
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
            </div>
          )}
          <ul className="space-y-2 ">
            {seenNotifications.length > 0 &&
              seenNotifications.map((notification, index) => (
                <div className=" min-w-full bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer grid grid-cols-1 md:grid-cols-11 gap-6 p-1">
                  <div
                    className="p-3 mr-5 hover:bg-gray-100 col-span-10"
                    onClick={() => {
                      notificationClickHandler(notification);
                    }}
                  >
                    {notification?.message}
                  </div>
                  <div
                    className="p-3 pr-5 mr-5 hover:bg-gray-100 cursor-pointer col-span-1 flex justify-end "
                    onClick={() => handleDeleteOneNotification(notification)}
                  >
                    <i class="ri-delete-bin-4-line"></i>
                  </div>
                </div>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SeenNotification;
