

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import AppointmentCard from '../components/appointmentCard';
import { getAllAppointmentsToday } from '../store/doctorState';

function Appointment() {
  const { user } = useSelector((state)=>state.user);
  // const { doctorId} = useSelector((state)=>state.user.user);

  console.log("at appointment");

  const {appointments} = useSelector((state)=>state.doctor);
  const dispatch = useDispatch();
  
  
  useEffect(() => {
    
    console.log("at appointment useeffect");
    console.log(user);
    if(user)
    dispatch(getAllAppointmentsToday({doctorId:user?.doctorId}));
  },[user?.doctorId]);

  return (
    <div>
    {
      appointments?.length > 0 ? 
      (
        appointments.map((appointment,index)=>(
          <AppointmentCard appointmentDetails={appointment} key={index}/>
        ))
      ) : (
        <div> No Appointments Today </div>
      )
    }
    </div>
  )
}

export default Appointment