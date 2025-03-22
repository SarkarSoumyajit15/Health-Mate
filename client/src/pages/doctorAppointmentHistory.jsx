import React, { useEffect } from 'react'
import HistoryBar from '../components/historyBar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorHistory } from '../store/doctorState';

function DoctorAppointmentHistory() {
    const dispatch = useDispatch();
    const {user} = useSelector((state)=>state.user);
    const { doctorHistory } = useSelector((state) => state.doctor);

    

  
    useEffect(() => {
      if(user?.doctorId)  
        dispatch(fetchDoctorHistory({doctorId:user.doctorId}));
    },[user]);
  
    return (
      <div className="max-w-4xl mx-auto space-y-4 mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Appointment History</h2>
        {doctorHistory ? (doctorHistory.map((history, index) => (
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

export default DoctorAppointmentHistory