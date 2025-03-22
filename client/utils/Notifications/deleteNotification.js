
import axiosInstance from "../../src/config/axios_config";
import toast from "react-hot-toast";

  const deleteAllNotifications = async () => {

    try {
      const response = await axiosInstance.post(
        "/api/users/delete-all-notifications",
        {},
        { withCredentials: true }
      );
      
        console.log(response?.data?.message);

        return response;
    } catch (error) {
      toast.error(`Error while deleting all notifications : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };


  
  const deleteOneNotification = async (notification) => {
    try {
      const response = await axiosInstance.post(
        "/api/users/delete-notification",
        { notificationId: notification._id },
        { withCredentials: true }
      );

      return response;
    } catch (error) {
      toast.error(`Error while deleting notification : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };


  export{
    deleteAllNotifications,
    deleteOneNotification,
  }