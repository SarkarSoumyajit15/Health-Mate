import { Popover } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Editor from "./editor";
import { jsPDF } from "jspdf";
import { addPrescription, cancelAppointment, completeAppointment, doctorActions } from "../store/doctorState";
import Viewer from "./viewer";

function AppointmentCard({ appointmentDetails }) {
  const dispatch = useDispatch();
  
  const [content, setContent] = useState("");
  // console.log("Appointment Details",appointmentDetails?.documents);

  const onCompleteHandler = () => {
    console.log("Appointment Completed");

    dispatch(doctorActions.removeAppointment({appointmentId:appointmentDetails?._id}));    

    // if any prescription is prescribed then add it to the database
    let prescriptionBlob = null;
    if(content !== ""){
      prescriptionBlob = handleExportPDF();
    }


    // now complete the appointment
    dispatch(
      completeAppointment({appointmentId:appointmentDetails?._id,doctorId:appointmentDetails?.doctorId,patientId:appointmentDetails?.patientId,prescriptionBlob})
    );
  };

  const onCanceledHandler = () => {
    console.log("Appointment Cancelled");
    dispatch(doctorActions.removeAppointment({appointmentId:appointmentDetails?._id}));    

    // now cancel the appointment
    dispatch(
      cancelAppointment({appointmentId:appointmentDetails?._id})
    );
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Prescription", 10, 10); // Title
    doc.text(content.replace(/<[^>]*>?/gm, ""), 10, 20); // Removing HTML tags

    const pdfBlob = doc.output('blob');
    // doc.save(`Prescription.pdf`);
    return pdfBlob;
  };

  // console.log(appointmentDetails?.appointmentDate);
  // console.log(typeof appointmentDetails?.appointmentDate);
  

  

  return (
    <div>

    <div className=" grid grid-cols-5 gap-4 p-4 bg-white rounded-lg shadow-md mb-3 ">
      <div className="mr-8 flex flex-col items-center justify-center">
        <img
          src={appointmentDetails?.profileImage} // Replace with actual petient image URL
          // alt="Patient Image"
          className="w-20 h-20 rounded-full object-cover bg-gray-300"
        />
        <h1 className="text-2xl font-semibold text-gray-800">
          {appointmentDetails?.username}
        </h1>
        <h1>{`Email : ${appointmentDetails?.email}`}</h1>
      </div>


      <div className="flex flex-col items-start  justify-center">
        <p className="text-gray-600">{appointmentDetails?.chamberLocation?.addressLine1},</p>
        <p className="text-gray-600">{appointmentDetails?.chamberLocation?.city}</p>
        <p className="text-indigo-600 font-semibold mt-2">
          {`Date :  ${new Date(
            appointmentDetails?.appointmentDate
          ).toLocaleTimeString()} of  ${new Date(
            appointmentDetails?.appointmentDate
          ).toLocaleDateString()}`}
        </p>
      </div>

      <div className="   ">
        <Viewer docs={appointmentDetails?.documents} />
      </div>

      <div className="flex flex-col items-center justify-center">
        <h1 className="">Add Prescription</h1>
        <PopOver content={content} setContent={setContent} />
        {/* <div className="text-4xl bg-slate-200 px-3 py-1 cursor-pointer rounded-full hover:bg-slate-300" onClick={}>
                <i class="ri-add-circle-line"></i>
              </div> */}
      </div>

      {/* now create 2 buttons , one for appointment completed and other for appointment cancelled */}
      <div className=" flex flex-col justify-center px-2 ml-8">
        <button
          className="bg-white  font-bold py-1 px-1 rounded shadow-blue-outer hover:shadow-blue-inner mb-3"
          onClick={onCompleteHandler}
        >
          Completed
        </button>
        <button className="bg-white  font-bold py-1 px-1 rounded shadow-red-outer hover:shadow-red-inner" onClick={onCanceledHandler}>
          Cancelled
        </button>

      </div>
    </div>

    </div>
  );
}

export default AppointmentCard;

const PopOver = ({ content, setContent }) => {
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      content={<Editor content={content} setContent={setContent} />}
      title="Prescription"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className="text-4xl bg-slate-200 px-3 py-1 cursor-pointer rounded-full hover:bg-slate-300">
        <i className="ri-add-circle-line"></i>
      </div>
    </Popover>
  );
};

// flex flex-col md:flex-row md:justify-between items-center gap-4
