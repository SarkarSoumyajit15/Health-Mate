import React, { useEffect, useState } from "react";
import { TimePicker } from "antd";
import axiosInstance from "../config/axios_config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorInfo } from "../store/doctorState";

function EditDoctorInfo() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  
  const {user} = useSelector((state)=>state.user);

  const {doctorInfos} = useSelector((state)=>state.doctor);
  const dispatch = useDispatch();

  const weekdayMapping = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const [doctorInfo, setDoctorInfo] = useState({
    firstname: "",
    lastname: "",
    address: "",
    phoneNumber: "",
    specialization: "",
    feePerConsultation: "",
    allTimings: [],
  });

  const [timings, setTimings] = useState({
    chamberLocation: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
    },
    weekday: "",
    durationInMinutes: "",
    fromTime: null,
    toTime: null,
  });

    useEffect(() => {
        if(user?.isDoctor){
            dispatch(
                fetchDoctorInfo({doctorId:user.doctorId})
            );
        }
    },[user]);

    useEffect(() => {
        if(doctorInfos){
            setDoctorInfo(doctorInfos);
        }
    },[doctorInfos]);

  const [isDisabled, setIsDisabled] = useState(true);
  const [isAddTimingDisabled, setIsAddTimingDisabled] = useState(true);

  const handleAddTiming = () => {
    // Convert the weekday to a number from the string
    let weekday = timings.weekday;
    const numWeekday = Number(weekday);
    setTimings({ ...timings, weekday: numWeekday });

    setDoctorInfo((prevDoctorInfo) => ({
      ...prevDoctorInfo,
      allTimings: [...prevDoctorInfo.allTimings, timings],
    }));

    setTimings({
      chamberLocation: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
      },
      weekday: "",
      durationInMinutes: "",
      fromTime: null,
      toTime: null,
    });
  };

  const handleDeleteTiming = (index) => {
    console.log(index);
    const allTimingsTemp = Array.from(doctorInfo.allTimings);
    // console.log("allTimings :",allTimingsTemp);
    allTimingsTemp.splice(index, 1);
    setDoctorInfo({
      ...doctorInfo,
      allTimings: allTimingsTemp,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      console.log("submiting");

      const response = await axiosInstance.post(
        "/api/doctors/request-for-edit-doctor-info",
        {
          doctorId : user?.doctorId,
          doctorInfo
        },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        toast.success("Succesfully Requested for Editing Doctor Info");
        navigate("/");
      }
    } catch (err) {
      toast.error(
        `Edit Doctor Info application failed : ${err?.response?.data?.message}`
      );
    }
  };

  useEffect(() => {
    if (
      doctorInfo.firstname !== "" &&
      doctorInfo.lastname !== "" &&
      doctorInfo.address !== "" &&
      doctorInfo.phoneNumber !== "" &&
      doctorInfo.specialization !== "" &&
      doctorInfo?.feePerConsultation !== null &&
      doctorInfo.allTimings.length > 0
    )
      setIsDisabled(false);
    else {
      setIsDisabled(true);
    }
  }, [doctorInfo]);

  useEffect(() => {
    if (
      timings.chamberLocation.addressLine1 !== "" &&
      timings.chamberLocation.addressLine2 !== "" &&
      timings.chamberLocation.city !== "" &&
      timings.chamberLocation.state !== "" &&
      timings.weekday !== "" &&
      timings.durationInMinutes !== "" &&
      timings.fromTime !== null &&
      timings.toTime !== null
    )
      setIsAddTimingDisabled(false);
    else setIsAddTimingDisabled(true);
    console.log(isAddTimingDisabled);
    console.log(timings);
  }, [timings]);

  return (
    <div className=" bg-gray-50 ">
      <div className="flex justify-center p-6">
        <h1 className=" font-bold text-2xl">Doctor Application Form</h1>
      </div>

      <div className=" font-semibold text-xl pt-8 pl-6">
        Personal Details
        <hr />
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Name Input */}
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-medium">
            Firstname
          </label>
          <input
            type="text"
            value={doctorInfo.firstname}
            name="Firstname"
            onChange={(e) =>
              setDoctorInfo({ ...doctorInfo, firstname: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-medium">
            Lastname
          </label>
          <input
            type="text"
            value={doctorInfo.lastname}
            name="lastname"
            onChange={(e) =>
              setDoctorInfo({ ...doctorInfo, lastname: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Input */}
        <div className="flex flex-col">
          <label htmlFor="phone" className="mb-2 font-medium">
            Phone
          </label>
          <input
            type="tel"
            value={doctorInfo.phoneNumber}
            name="phone"
            onChange={(e) =>
              setDoctorInfo({ ...doctorInfo, phoneNumber: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address Input */}
        <div className="flex flex-col">
          <label htmlFor="address" className="mb-2 font-medium">
            Address
          </label>
          <input
            type="text"
            value={doctorInfo.address}
            name="address"
            onChange={(e) =>
              setDoctorInfo({ ...doctorInfo, address: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>
      <hr />

      <div className=" font-semibold text-xl pt-8 pl-6">
        Professional Details
        <hr />
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-medium">
            Specialization
          </label>
          <input
            type="text"
            value={doctorInfo.specialization}
            name="specialization"
            onChange={(e) =>
              setDoctorInfo({ ...doctorInfo, specialization: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="FeePerConsultation" className="mb-2 font-medium">
            FeePerConsultation
          </label>
          <input
            type="number"
            value={doctorInfo?.feePerConsultation}
            name="feePerConsultation"
            onChange={(e) =>
              setDoctorInfo({
                ...doctorInfo,
                feePerConsultation: e.target.value,
              })
            }
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
      </form>
      <hr />

      {/* Timings and Chamber Locations */}

      <div className=" font-semibold text-xl pt-8 pl-6">
        Timing and Location Details
        <hr />
      </div>

      <div className="bg-gray-300 py-1 px-1">
        <form className="grid grid-cols-2 md:grid-cols-6 gap-3 p-3">
          <div className="flex flex-col col-span-1">
            <label htmlFor="name" className="mb-2 font-medium">
              Day
            </label>
            <select
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={timings.weekday}
              onChange={(e) =>
                setTimings({ ...timings, weekday: e.target.value })
              }
            >
              <option value="">Select Day</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
              <option value="0">Sunday</option>
            </select>
          </div>

          <div className="flex flex-col col-span-1">
            <label htmlFor="name" className="mb-2 font-medium">
              Duration (in minutes)
            </label>
            <select
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={timings.durationInMinutes}
              onChange={(e) =>
                setTimings({
                  ...timings,
                  durationInMinutes: Number(e.target.value),
                })
              }
            >
              <option value="">Select Duration</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="60">60</option>
            </select>
          </div>

          <div className="flex flex-col col-span-2">
            <label htmlFor="name" className="mb-2 font-medium">
              Chamber Location
            </label>
            <div className="flex flex-col">

              <input
                type="text"
                value={timings.chamberLocation.addressLine1}
                name="specialization"
                placeholder="Address Line 1"
                onChange={(e) =>
                  setTimings((prevTimings) => ({
                    ...prevTimings,
                    chamberLocation: {
                      ...prevTimings.chamberLocation,
                      addressLine1: e.target.value,
                    },
                  }))
                }
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 mb-1"
              />

              <input
                type="text"
                value={timings.chamberLocation.addressLine2}
                name="specialization"
                placeholder="Address Line 2"
                onChange={(e) =>
                  setTimings((prevTimings) => ({
                    ...prevTimings,
                    chamberLocation: {
                      ...prevTimings.chamberLocation,
                      addressLine2: e.target.value,
                    },
                  }))
                }
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 my-1"
              />

              <input
                type="text"
                value={timings.chamberLocation.city}
                name="specialization"
                placeholder="City"
                onChange={(e) =>
                  setTimings((prevTimings) => ({
                    ...prevTimings,
                    chamberLocation: {
                      ...prevTimings.chamberLocation,
                      city: e.target.value,
                    },
                  }))
                }
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 my-1"
              />

              <input
                type="text"
                value={timings.chamberLocation.state}
                name="specialization"
                placeholder="State"
                onChange={(e) =>
                  setTimings((prevTimings) => ({
                    ...prevTimings,
                    chamberLocation: {
                      ...prevTimings.chamberLocation,
                      state: e.target.value,
                    },
                  }))
                }
                className="p-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:shadow-inner my-1"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="FromTime" className="mb-2 font-medium">
              From Time
            </label>
            <TimePicker
              className="py-2 pt-3"
              value={timings?.fromTime}
              onChange={(e) => {
                setTimings({ ...timings, fromTime: e });
              }}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="FromTime" className="mb-2 font-medium">
              To Time
            </label>
            <TimePicker
              className="py-2 pt-3"
              value={timings?.toTime}
              onChange={(e) => {
                console.log(typeof e);
                console.log(e);
                console.log(e.hour());
                setTimings({ ...timings, toTime: e });
              }}
            />
          </div>
        </form>

        {/* Add Timings Button */}
        <div className="flex ml-auto justify-center my-2 ">
          <button
            onClick={handleAddTiming}
            disabled={isAddTimingDisabled}
            className={` px-2 py-1 bg-green-500 text-white rounded-md ${
              !isAddTimingDisabled && " hover:bg-green-600"
            }  focus:outline-none focus:ring-2 focus:ring-green-500  ${
              isAddTimingDisabled && " bg-green-400"
            }`}
          >
            Add Timing
          </button>
        </div>

        <div className="bg-slate-200 mb-9">
          {doctorInfo.allTimings.length > 0 &&
            doctorInfo.allTimings.map((timings, index) => (
              <div key={index} className="flex justify-between items-center p-2">
                <div className="text-gray-600 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <span className="px-3 col-span-1">
                    {weekdayMapping[timings.weekday]}
                  </span>
                  <span className="px-3 col-span-1">
                    {timings.durationInMinutes} mins
                  </span>
                  <div className="px-3 col-span-1">
                    <div className="">{`${timings.chamberLocation.addressLine1} ,`}</div>
                    <div className="mt-1">{timings.chamberLocation.city}</div>
                  </div>
                  <div className="px-3 col-span-1">
                    <span className="">{(new Date(timings.fromTime)).toLocaleTimeString()}</span>
                  </div>
                  <div className="px-3 col-span-1">
                  <span className="">{(new Date(timings.toTime)).toLocaleTimeString()}</span>

                  </div>
                </div>
                <div>
                  <button
                    className=" rounded-md px-2 py-1 shadow-md hover:shadow-inner bg-slate-100 mr-5"
                    onMouseEnter={()=>{
                      setIsOpen(true);
                    }}
                    onMouseLeave={
                      ()=>{
                        setIsOpen(false);
                      }
                    }
                    onClick={() => {
                      handleDeleteTiming(index);
                    }}
                  >
                    {isOpen ? (<i className="ri-delete-bin-5-line"></i>):(<i className="ri-delete-bin-line"></i>)}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <hr />

      {/* Submit Button */}
      <div className="pr-6 flex ml-auto justify-end p-2">
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={` px-5 py-3 bg-blue-500 text-white rounded-md ${
            !isDisabled && " hover:bg-blue-600"
          }  focus:outline-none focus:ring-2 focus:ring-blue-500  ${
            isDisabled && " bg-blue-400"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default EditDoctorInfo;
