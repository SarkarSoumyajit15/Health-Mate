import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {jsPDF} from 'jspdf';
import axiosInstance from '../config/axios_config';

const Editor = ({content,setContent}) => {

  const [loading, setLoading] = useState(true);

  // Fetch appointment data
//   useEffect(() => {
//     const fetchAppointment = async () => {
//       try {
//         const response = await axios.get(`/api/appointment/${appointmentId}`);
//         setContent(response.data.prescription || '');
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching appointment data', error);
//         setLoading(false);
//       }
//     };

//     fetchAppointment();
//   }, [appointmentId]);



  // Save prescription
  // const handleSave = async () => {
  //   console.log(typeof content);

  //   try {
  //       const pfdPrescription = handleExportPDF();
  //       console.log(typeof pfdPrescription);
  //   } catch (error) {
  //     console.error('Error saving prescription');
  //     console.log(error);
  //     alert('Failed to save prescription.');
        
  //   }

    
    // try {
    //   await axios.put(`/api/appointment/${appointmentId}/prescription`, { prescription: content });
    //   alert('Prescription saved successfully!');
    // } catch (error) {
    //   console.error('Error saving prescription', error);
    //   alert('Failed to save prescription.');
    // }
  // };

//   if (loading) return <p>Loading...</p>;

  return (
    <div className="prescription-editor max-w-2xl mx-auto p-4 shadow-lg border rounded ">
      <h2 className="text-lg font-semibold mb-4">Write Prescription</h2>
      <ReactQuill
        value={content}
        onChange={setContent}
        placeholder="Write the prescription here..."
      />
    </div>
  );
};

export default Editor;
