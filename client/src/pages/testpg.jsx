import React from 'react'



const HistoryBar = ({ title, date, doctor, prescription }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
      {/* Left Section */}
      <div>
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">Date: {new Date(date).toLocaleDateString()}</p>
        <p className="text-sm text-gray-500">Doctor: {doctor}</p>
      </div>

      {/* Right Section */}
      <div className="text-right">
        {prescription ? (
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            onClick={() => alert(`Prescription: ${prescription}`)}
          >
            View Prescription
          </button>
        ) : (
          <span className="px-4 py-2 text-sm text-gray-400">No Prescription</span>
        )}
      </div>
    </div>
  );
};


const AppointmentHistory1 = () => {
  const historyData = [
    {
      title: "General Checkup",
      date: "2024-12-01",
      doctor: "Dr. John Doe",
      prescription: "Paracetamol, Vitamin C",
    },
    {
      title: "Dental Cleaning",
      date: "2024-11-15",
      doctor: "Dr. Jane Smith",
      prescription: null, // No prescription for this appointment
    },
    {
      title: "Eye Exam",
      date: "2024-10-05",
      doctor: "Dr. Emily Brown",
      prescription: "Eyedrops",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4 mt-8">
      <h2 className="text-2xl font-bold text-gray-800">Appointment History</h2>
      {historyData.map((history, index) => (
        <HistoryBar
          key={index}
          title={history.title}
          date={history.date}
          doctor={history.doctor}
          prescription={history.prescription}
        />
      ))}
    </div>
  );
};



// Sample data

const Testpg = () => {
  return <AppointmentHistory1 />;
};

export default Testpg;
