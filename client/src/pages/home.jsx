import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DoctorCard from "../components/doctorCard";
import { doctorActions, fetchAllDoctors } from "../store/doctorState";
import Loader from "../components/loader";
import toast from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";
import Doctor from "../components/doctor";

const Home = () => {
  const dispatch = useDispatch();
  const { doctorDetailsPage,doctorlist, loading, error, filters, pagination } = useSelector(
    (state) => state.doctor
  );

  const navigate = useNavigate();

  useEffect(
    () => {
      dispatch(
        fetchAllDoctors(
          { page: pagination.currentPage, limit: pagination?.limit, filters },
          { signal: null }
        )
      );
    },
    [pagination.currentPage, pagination.limit, filters],
    []
  );


  const handlePageLimitChange = (event) => {
    const selectElement = event.target;
    const limit = selectElement.value;
    console.log("limit", limit);
    dispatch(doctorActions.setPageLimit(limit));
  };

  const handlePageChange = (newPage) => {
    dispatch(doctorActions.setPage(newPage)); // Update current page in Redux state
  };

  const handleFilterChange = (newFilters) => {
    dispatch(doctorActions.setFilters(newFilters)); // Update filters and reset pagination
  };

  return (
    <div>
      {doctorDetailsPage ? (
        <Outlet />
      ) : (
        <div className="">
          {/* Render loading state */}
          {loading && <Loader />}

          {/* Render error state */}

          {/* Render filters */}
          <Filters filters={filters} handleFilterChange={handleFilterChange} />

          {/* Render the list of doctors or the doctors page conditionally */}

          <div className=" ml-1 p-2 pl-12 mt-1 rounded-md grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 bg-blue-100">
            {doctorlist.length > 0 ? (
              doctorlist?.map((doctor,index) => (
                <div key={index}
                  onClick={() => {
                    dispatch(doctorActions.setCurrentDoctor(doctor));
                    dispatch(doctorActions.setDoctorDetailsPage());
                    navigate(`/doctor/${doctor.doctorId}`);
                  }}
                >
                  <DoctorCard doctor={doctor} />
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center bg-gray-50 col-span-2 h-[50vh] rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800">
                  No doctors found
                </h2>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            handlePageLimitChange={handlePageLimitChange}
          />
        </div>
      )}
    </div>
  );
};



const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  handlePageLimitChange,
}) => {
  return (
    <div className=" ml-1  my-2 px-2 py-1 bg-slate-100  flex justify-between rounded-md">
      <div className="flex items-center">
        <select
          className="px-2 py-1 bg-gray-300 rounded-lg "
          onChange={(e) => handlePageLimitChange(e)}
        >
          <option value="6">6/page</option>
          <option value="10">10/page</option>
          <option value="20">20/page</option>
          <option value="30">30/page</option>
        </select>
      </div>
      <div className=" flex flex-col items-center">
        {totalPages > 1 && (
          <div className="flex justify-between ">
            <button
              className={` px-2 py-1 mr-2 text-white rounded-lg ${
                !(currentPage === 1) && "bg-blue-600"
              } `}
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <button
              className={`px-2 py-1 ml-2  text-white rounded-lg ${
                !(currentPage === totalPages) && "bg-blue-600"
              }`}
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        )}
        <span className=" m-2 px-3 py-1 bg-gray-300 text-gray-800 rounded">
          {currentPage} / {totalPages}
        </span>
      </div>
    </div>
  );
};

const Filters = ({ filters, handleFilterChange }) => {
  const [specialization, setSpecialization] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="px-10 py-4 bg-slate-400 rounded-md ">
      <div className="flex ">
        {/* <h2 className="text-2xl font-bold text-white">Filter : </h2> */}
        {filters?.specialization.trim() == "" && filters?.name.trim() == "" ? (
          <div className="bg-teal-50 content-center rounded p-1">
            <i className="ri-filter-line"></i>
          </div>
        ) : (
          <div
            title="Remove all filters"
            className="bg-teal-100 content-center rounded p-1 hover:bg-teal-200 cursor-pointer"
            onClick={() => {
              setSpecialization("");
              setName("");
              handleFilterChange({ specialization: "", name: "" });
            }}
          >
            <i class="ri-filter-off-line"></i>
          </div>
        )}

        <div className="mx-3 pr-2 flex  bg-slate-500  rounded-md ">
          <input
            type="text"
            placeholder="Search by name"
            className="mr-0 px-2 py-1 bg-gray-100 rounded-lg rounded-r-none"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <div
            className=" pl-2 flex items-center justify-center cursor-pointer text-gray-200 hover:text-white "
            onClick={() => handleFilterChange({ name: name })}
          >
            <i className="ri-search-line"></i>
          </div>
        </div>

        <div className=" mx-3 pr-2 flex bg-slate-500 rounded-md">
          <input
            type="text"
            placeholder="Search by specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="mr-0 px-2 py-1 bg-gray-100 rounded-lg rounded-r-none"
          />
          <div
            className=" pl-2 flex items-center justify-center cursor-pointer text-gray-200 hover:text-white "
            onClick={() => handleFilterChange({ specialization })}
          >
            <i className="ri-search-line"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

