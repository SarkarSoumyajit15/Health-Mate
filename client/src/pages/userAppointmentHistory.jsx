import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchUserHistory } from "../store/userState";

import HistoryBar from "../components/historyBar";

function UserAppointmentHistory() {
  const dispatch = useDispatch();
  const { userHistory } = useSelector((state) => state.user);


  useEffect(() => {
    dispatch(fetchUserHistory());
  },[]);

  return (
    <div className="max-w-3xl mx-auto space-y-4 mt-8">
      <h2 className="text-2xl font-bold text-gray-800">Appointment History</h2>
      {userHistory ? (userHistory.map((history, index) => (
        <HistoryBar
          key={index}
          history = {history}
        />
      ))):(
        <div>No Previous Records</div>
      )}
    </div>
  )

}

export default UserAppointmentHistory;

