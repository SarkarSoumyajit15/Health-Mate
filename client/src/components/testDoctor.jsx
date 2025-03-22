import React, { useEffect, useState } from "react";
import { Button, Popover } from "antd";
import { doctorActions } from "../store/doctorState";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../config/axios_config";
import toast from "react-hot-toast";
import MyFileDragger from "./myFileDragger";

function TestDoctor() {
  const { currentDoctor } = useSelector((state) => state.doctor);

  const { doctorId } = useParams();
  const [chambers, setChambers] = useState([]);

  const [bookingCharges, setBookingCharges] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [latestAppointmentTimings, setLatestAppointmentTimings] =
    useState(null);

  const [chamberData, setChamberData] = useState(null);
  
  const monthMapping = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  };
  
  const dayMapping = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };
  
  
  
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [files,setFiles] = useState([]);

  

  const fetchAllChambers = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/doctors/get-all-chambers`,
        {
          params: { doctorId: doctorId },
          withCredentials: true,
        }
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
      // first create an order in razorpay

      const response = await axiosInstance.post("/api/payment/create-order", {
        bookingCharges,
      });

      if (response.status !== 200) {
        alert("Something went wrong, please try again later");
        return;
      }
      const dataobj = response.data.newOrder;
      const options = {
        key: "rzp_test_DsYDV8cBnMRJMx",
        amount: dataobj.amount,
        order_id: dataobj.id,
        handler: async function (response) {
          // handle the response
          const paymentId = response.razorpay_payment_id;
          const signature = response.razorpay_signature;
          console.log(paymentId, signature);
          // send the paymentId and signature to the server
          const paymentResponse = await axiosInstance.post(
            "/api/payment/verify-payment",
            {
              orderId: dataobj.id,
              razorpayPaymentId: paymentId,
              razorpaySignature: signature,
            },
            { withCredentials: true }
          );
          if (paymentResponse.status === 200) {
            toast.success("Payment Successful");

            // Now book the appointment

            // first create an formdata containing all the files uploaded using forEach function
            const formData = new FormData();
            files.forEach((file) => {
              formData.append("files", file);
            });

            formData.append('chamberId', chamberData._id);
            formData.append('doctorId', doctorId);

            const bookAppointmentResponse = await axiosInstance.post(
              `/api/appointments/book-appointment`,
              formData,
              { withCredentials: true }
            );
            if (bookAppointmentResponse.data.success) {
              toast.success(bookAppointmentResponse.data.message);
              dispatch(doctorActions.unsetDoctorDetailsPage());
            }
          } else {
            toast.error("Payment Failed");
          }
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      toast.error("Could not book appointment");
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchAllChambers();
  }, [doctorId]);

  useEffect(() => {
    setBookingCharges(Math.ceil(currentDoctor?.feePerConsultation / 10));
  }, [currentDoctor]);

  useEffect(() => {
    if (chamberData) {
      setDisableSubmit(false);
      fetchLatestAppointmentTimingsPossibleWithFilters();
    }
  }, [chamberData]);

  useEffect(() => {
    return () => {
      dispatch(doctorActions.unsetDoctorDetailsPage());
      dispatch(doctorActions.unsetCurrentDoctor());
    };
  }, []);

  useEffect(() => {
    // Dynamically load the Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const starArray = Array.from({ length: 4 });

  const [time, setTime] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg max-w-full">
      <script
        src="https://checkout.razorpay.com/v1/checkout.js"
        type="text/javascript"
      />

      {/* Doctor Details Section */}
      <div className=" flex justify-between bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4 ">
          <img
            src="https://via.placeholder.com/150" // Replace with actual doctor image URL
            alt="Doctor"
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-semibold text-gray-800">
              {`${currentDoctor?.firstname} ${currentDoctor?.lastname}`}
            </h1>
            <p className="text-gray-600">{currentDoctor?.specialization}</p>
            <p className="text-indigo-600 font-semibold mt-2">
              ₹{currentDoctor?.feePerConsultation} per consultation
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="">
            {starArray.map((_, index) => (
              <i key={index} className="ri-star-fill text-yellow-400"></i>
            ))}
            <div className="">
              Global rating:<span className=" font-bold">4.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chambers and Timings Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Chambers & Timings
        </h2>
        <div className="space-y-4">
          {chambers.length > 0 &&
            chambers.map((chamber, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 border rounded-lg border-gray-200"
              >
                <div>
                  <p className="text-gray-500">
                    {chamber?.chamberLocation?.addressLine1},
                  </p>
                  <p className="text-gray-500">
                    {chamber?.chamberLocation?.addressLine2},
                  </p>
                  <p className="text-gray-500">
                    {chamber?.chamberLocation?.city}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">
                    {dayMapping[chamber.weekday]}
                  </p>
                  <div className=" text-gray-600">{`Timings : ${new Date(
                    chamber.startTime
                  ).toLocaleTimeString()}   -   ${new Date(
                    chamber.endTime
                  ).toLocaleTimeString()}`}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <PopOver setChamberData={setChamberData} chambers={chambers} />

      {latestAppointmentTimings && (
        <div className=" p-2 bg-slate-200 rounded-md pb-4 my-4">
          <div>{`Your appointment is available latest by  : ${new Date(
            latestAppointmentTimings
          ).toLocaleDateString()}   at  ${new Date(
            latestAppointmentTimings
          ).toLocaleTimeString()} in Your chosen chamber location `}</div>
        </div>
      )}
      {/* Book Appointment Button */}
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className=" flex justify-start ">
          <h1 className=" px-3 py-1 max-w-fit bg-white text-red-600 font-bold text-lg animate-blink ease-in-out ">{`₹ ${bookingCharges} Booking Charge`}</h1>
        </div>
        <div className="flex flex-col items-center justify-center">
          {/* an UI to add prescription or other clinical test results */}

          <h1 className="">Add Prescriptions or Test Results</h1>
          <AddFilesPopOver files = {files} setFiles = {setFiles}/>
        </div>
        <div className=" flex justify-end">
          <button
            onClick={() => handleAppointmentBooking()}
            disabled={disableSubmit}
            className={`px-6 py-3 bg-indigo-600 ${
              disableSubmit && "bg-indigo-400"
            } text-white font-semibold rounded-lg ${
              !disableSubmit && "hover:bg-indigo-700 transition duration-300"
            }`}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

const PopOver = ({ setChamberData, chambers }) => {
  const [open, setOpen] = useState(false);

  const weekdayMapping = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    0: "Sunday",
  };

  // console.log(chambers.length);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  return (
    <Popover
      content={
        <div className=" md:min-w-80">
          <div onClick={hide}>
            <i class="ri-close-line text-blue-500"></i>
          </div>
          {chambers.length > 0 &&
            chambers.map((chamber, index) => (
              <div
                className="grid grid-cols-3 md:grid-cols-6 gap-3 p-3 hover:bg-slate-100 cursor-pointer"
                onClick={() => {
                  setChamberData(chamber);
                  hide();
                }}
              >
                <div className=" col-span-1">
                  {weekdayMapping[chamber.weekday]}
                </div>
                <div className=" col-span-1">{`${new Date(
                  chamber.startTime
                ).toLocaleTimeString()}`}</div>
                <div className=" col-span-1">{`${new Date(
                  chamber.endTime
                ).toLocaleTimeString()}`}</div>
                <div className=" col-span-1">{`${chamber.chamberLocation?.addressLine1} , ${chamber.chamberLocation?.city}`}</div>
              </div>
            ))}
        </div>
      }
      //   title="Select Time"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type="primary">Choose Dates</Button>
    </Popover>
  );
};

export default TestDoctor;







const AddFilesPopOver = ({files,setFiles}) => {
  const [open, setOpen] = useState(false);


  // console.log(chambers.length);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  return (
    <Popover
      content={
        <MyFileDragger files = {files} setFiles = {setFiles} />
      }
      //   title="Select Time"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type="primary">Add Files</Button>
    </Popover>
  );
};
