import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../config/axios_config";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { doctorActions } from "../store/doctorState";

function Doctor() {
  const { doctorId } = useParams();
  const [chambers, setChambers] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [latestAppointmentTimings, setLatestAppointmentTimings] = useState(null);

  const weekdayMapping = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    0: "Sunday",
  };

  const monthMapping = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  }

  if(chambers?.length > 0)
  console.log(new Date(chambers[0].startTime).getHours());
  const [chamberData, setChamberData] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(true);
  
  const fetchAllChambers = async () => {
    try {
      const response = await axiosInstance.get(`/api/doctors/get-all-chambers`, 
        {
          params: {doctorId: doctorId},
          withCredentials: true,
        },
      );
      
      if (response.data.success) {
        setChambers(response.data.chambers);
        console.log(response.data.message);
      }
    } catch (err) {
      toast.error(
        "Could not fetch chambers for doctor with doctorID : " + doctorId
      );
      toast.error(err.message);
    }
  };

  const fetchLatestAppointmentTimingsPossibleWithFilters = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/appointments/fetch-latest-appointment-timings-possible-with-filters`,
        {
          doctorId: doctorId,
          chamberId: chamberData._id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setLatestAppointmentTimings(response.data.availableDate);
      }
    } catch (err) {
      toast.error("Could not fetch latest appointment timings");
      toast.error(err.message);
    }
  };

  const handleAppointmentBooking = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/appointments/book-appointment`,
        {
          chamberId: chamberData._id,
          doctorId: doctorId,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(doctorActions.unsetDoctorDetails());
      }
    } catch (err) {
      toast.error("Could not book appointment");
      toast.error(err.message);
    }
  }

  useEffect(() => {
    fetchAllChambers();
  }, [doctorId]);

  useEffect(() => { 
    if(chamberData){
      setDisableSubmit(false);
      fetchLatestAppointmentTimingsPossibleWithFilters();
    }
  }, [chamberData]);

  useEffect(() => {
    return () => {
      dispatch(doctorActions.unsetDoctorDetails());
    };
  }
  , []);

  return (
    <div className="bg-gray-300 py-1 px-1">
      {chambers.length > 0 &&
        chambers.map((chamber, index) => (
          <div  className="grid grid-cols-3 md:grid-cols-6 gap-3 p-3 hover:bg-slate-100 cursor-pointer" onClick={()=>{setChamberData(chamber)}}>
            <div className=" col-span-1">{weekdayMapping[chamber.weekday]}</div>
            <div className=" col-span-1">{`${new Date(chamber.startTime).getHours()}:${new Date(chamber.startTime).getMinutes()}:${new Date(chamber.startTime).getSeconds()}`}</div>
            <div className=" col-span-1">{`${new Date(chamber.endTime).getHours()}:${new Date(chamber.endTime).getMinutes()}:${new Date(chamber.endTime).getSeconds()}`}</div>
            <div className=" col-span-1">{chamber.chamberLocation}</div>
          </div>
        ))}
        <div className=" p-2 bg-slate-200 rounded-md pb-4">
          {latestAppointmentTimings && (
            <div>{`Your appointment is available latest by  : ${new Date(latestAppointmentTimings).getDate()} of ${monthMapping[13]} at ${new Date(latestAppointmentTimings).getHours()}:${new Date(latestAppointmentTimings).getMinutes()}:${new Date(latestAppointmentTimings).getSeconds()} in Your chosen chamber location `}</div>
          )}
        </div>
        <div className="pr-6 flex ml-auto justify-end p-2">
        <button
          onClick={handleAppointmentBooking}
          disabled={disableSubmit}
          className={` px-5 py-3 bg-blue-500 text-white rounded-md ${
            !disableSubmit && " hover:bg-blue-600"
          }  focus:outline-none focus:ring-2 focus:ring-blue-500  ${
            disableSubmit && " bg-blue-400"
          }`}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}



export default Doctor;