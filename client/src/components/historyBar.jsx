import { FaRegEye } from "react-icons/fa";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import axiosInstance from "../config/axios_config";
import toast from "react-hot-toast";
import { useState } from "react";
import { Popover } from "antd";

const HistoryBar = ({ history }) => {
  // const [prescript, setPrescript] = useState(null);

  // const previewPrescription = async() => {
  //   console.log("Preview Prescription");
  //   if(prescript){
  //     window.open(prescript.output('bloburl'), '_blank');
  //     return;
  //   }

  //   // fetch the prescription from the server and preview it
  //   try {
  //     const response = await axiosInstance.get(`/api/appointments/fetch-prescription?appointmentId=${history?.appointmentId}`,{withCredentials:true});
  //     console.log(response);
  //     if(response.status === 200){
  //       setPrescript(response.data.prescription);
  //       window.open(response.data.prescription.output('bloburl'), '_blank');
  //     }
  //     else if(response.status == 204 ){
  //       toast.error("No prescription found for this appointment");
  //     }
  //   } catch (err) {
  //     toast.error(`Could not preview the prescription : ${err}`);
  //   }
  // }

  // const downloadPrescription = async() => {
  //   console.log("Download Prescription");
  //   if(prescript){
  //     // prescript.save(`Prescription-${history?.title}.pdf`);
  //     return;
  //   }

  //   // fetch the prescription from the server
  //   try {
  //     const response = await axiosInstance.get(`/api/appointments/fetch-prescription/?appointmentId=${history?.appointmentId}`,{withCredentials:true});
  //     if(response.status === 200){
  //       console.log("hi");
  //       console.log(response.data.prescriptionUrl);
  //       // setPrescript(response.data.prescription);
  //       // response.data.prescription.save(`Prescription-${history?.title}.pdf`);
  //     }
  //     else if(response.status === 204){
  //       toast.error("No prescription found for this appointment");
  //     }
  //   } catch (err) {
  //     toast.error(`Could not download the prescription : ${err}`);
  //   }
  // }

  return (
    <div className="flex items-center justify-between px-4 py-2 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
      {/* Left Section */}
      <div>
        <h3 className="font-semibold text-lg text-gray-800">
          {history?.title}
        </h3>
      </div>

      {/* Right Section */}
      <div className="text-right flex justify-between ">
        <div className="flex flex-col items-center justify-center mx-4">
          <div className=" flex items-center">          
            <PrescriptionPopOver url={history?.prescriptionUrl} />
            <div
              className=" px-2 py-0 ml-2 hover:bg-slate-100 shadow-md hover:shadow-inner flex items-center"
            >
              <a  download={`Prescription-${history?.title}.pdf`} href={history?.prescriptionUrl}  >
                <button><HiOutlineDocumentDownload /></button>
              </a>
            </div>
          </div>
        </div>

        <div className=" pl-3 ">
          <h3 className="text-sm text-gray-500 relative top-0 right-0 ">
            Dated: {new Date(history?.date).toLocaleDateString()}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default HistoryBar;

const PrescriptionPopOver = ({ url }) => {
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      content={
        <div class="  flex flex-col items-center justify-center w-[700px] max-h-[600px] max-w-5xl p-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">
            Preview the PDF
          </h2>

          <div class="  w-full max-w-4xl aspect-[3/4] border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <iframe src={url} class="w-full h-full" frameborder="0"></iframe>
          </div>
        </div>
      }
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className=" px-2 py-1 mr-2 hover:bg-slate-100  shadow-md hover:shadow-inner ">
        <FaRegEye />
      </div>
    </Popover>
  );
};
