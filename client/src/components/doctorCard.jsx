import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DoctorCard = ({ doctor }) => {




  // useEffect(() => {

  // }, [doctor]);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-gray-50 m-4 col-span-1 hover:scale-105 hover:shadow-indigo-400">
      <div className = "flex pl-3 pr-2 py-2 justify-between bg-slate-200 border-t-2 border-slate-50 border-opacity-40">
        {doctor.profileImage ? (
          <div className="rounded-full bg-slate-300  px-2 align-middle text-gray-200 ">
            <img className=" w-24 h-24 rounded-full object-cover" src={doctor.profileImage} alt="Doctor" />
          </div>
        ) : (
          <div className=" rounded-full bg-slate-700 text-3xl py-6 px-8 align-middle text-gray-200">
            <i className="ri-user-line"></i>
          </div>
        )}
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">
            {doctor.firstname} {doctor.lastname}
          </div>
          <p className="text-gray-700 text-base">{doctor.specialization}</p>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded">
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
