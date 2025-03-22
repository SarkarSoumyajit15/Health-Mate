import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../config/axios_config';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../store/userState';
import { deleteOneNotification } from '../../utils/Notifications/deleteNotification';

const NotificationDetails = ({notificationDetails,setIsDetailsPage,clickedNotification}) => {

  const dispatch = useDispatch();

  const [type, setType] = useState(clickedNotification?.type);
  console.log("Clicked notification",clickedNotification);

  const handleAccept = async (Notification) => {
    try {

      const path = Notification?.actionAcceptPath;
      const data = Notification?.dataToBeSentOnActionAccept;
      const response = await axiosInstance.post(
        path,
        {...data,notificationId:Notification._id},
        { withCredentials: true }
      );

      if (response?.data?.success) {
        dispatch(userActions.changeNotificationType({notificationId:Notification._id,type:'info'}));
        setType('info');
      }

      toast.success(`${response?.data?.message}`);
    } catch (error) {
      toast.error(`Error while accepting candidate : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };
    

  const handleReject = async (Notification) => {  
    try {


      const path = Notification?.actionRejectPath;
      const data = Notification?.dataToBeSentOnActionReject;

      const response = await axiosInstance.post(
        path,
        {...data,notificationId:Notification._id},
        { withCredentials: true }
      );

      if (response?.data?.success) {
        console.log("Candidate has been rejected");
        dispatch(userActions.changeNotificationType({notificationId:Notification._id,type:'info'}));
        setType('info');
      }

      toast.success(`${response?.data?.message}`);

      
      const res = await deleteOneNotification(Notification);

      if (res?.data?.success) {
        console.log("Notification has been deleted");
        dispatch(
          userActions.unsetOneSeenNotification({
            notificationId: Notification._id,
          })
        );
      }

      console.log(res?.data?.message);
    

      console.log(response?.data?.message);
    } catch (error) {
      toast.error(`Error while rejecting candidate : ${error}`);
      console.log(`Sorry oops : ${error}`);
    }
  };
    


    const keyMapping = {
        firstname: 'First Name',
        lastname: 'Last Name',
        phoneNumber: 'Phone Number',
        address: 'Address',
        specialization: 'Specialization',
        feePerConsultation: 'Fee Per Consultation',
        isApproved: 'Is Approved',
        fromTime: 'From Time',
        toTime: 'To Time',
        // Add more mappings as needed based on the backend keys
        someArbitraryKey: 'Proper Name for Key',
        message : 'Message',
        // doctorId : 'Doctor-Id',
        // userId : 'User-Id',
        // patientId: 'Patient-Id',
        appointmentDate: 'Appointment Date',
        allTimings : 'All Timings',
        chamberLocation: 'Chamber Location',
        addressLine1: 'Address Line 1',
        addressLine2: 'Address Line 2',
        city: 'City',
        state: 'State',
    };



  const renderJson = (json) => {
    if (typeof json === 'object' && json !== null) {
      return Object.keys(json).map((key) => (
        <div>
          {keyMapping[key] && 
        <div key={key}  className="flex justify-between items-center ">
          <strong className="font-medium text-gray-600 m-2 p-2">{keyMapping[key]}:</strong>
          {typeof json[key] === 'object' ? (
            <div className='ml-4'>{renderJson(json[key])}</div>
          ) : (
            <span> {String(json[key])}</span>
          )}
        </div>}
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="min-w-full mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">

      <button onClick={()=>{
        // window.location.reload();
        setIsDetailsPage(false);
        }
        } className="m-4 ml-1  px-3 rounded-md bg-gray-300 hover:bg-gray-400 cursor-pointer">
        <i className="ri-arrow-left-line "></i>
      </button>

      <h2 className="text-lg font-bold mb-4">Review Candidate</h2>
      <div className="space-y-4  my-8 py-4 px-6">
        {renderJson(notificationDetails)}
      </div>
      {type === 'action' ?
      (<div className='flex justify-between'>
        <button className='px-3 py-1 ml-8 bg-green-400 hover:bg-green-500 rounded-md' onClick={()=>{handleAccept(clickedNotification)}}>Accept</button>
        <button className='px-3 py-1 mr-5 bg-red-400 hover:bg-red-500 rounded-md' onClick={()=>{handleReject(clickedNotification)}}>Reject</button>
      </div>) : (
        <div className='bg bg-blue-500 px-3 py-1 m-1'>
          <h1>Status : Action Performed </h1>
        </div>
      )}
    </div>
  );
};

export default NotificationDetails;