import React, { useState } from "react";


const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[800px] h-screen">
        <button
          className="relative top-2 right-2 text-blue-500 hover:text-blue-700  px-2 rounded-full shadow-blue-outer hover:shadow-blue-inner transition"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};



const Viewer = ({ docs }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // const attachments = {
  //   Documents: docs,
  // };

  const documents = docs;

  const openModal = (file) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const [hovered, setHovered] = useState(null);

  return (
    <div>
      <div className="relative h-20 w-32 mx-auto bg-gray-50 px-4 rounded-lg shadow-lg">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ transition: "all 0.3s ease" }}
        >
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`absolute left-0 w-full p-4 bg-white rounded-lg shadow-blue-300 shadow-sm cursor-pointer transition-all duration-300 `}
              style={{
                left: hovered === null ? `${index * 10}px` : `${index * 120}px`, // Show them non-overlapping on hover
                zIndex: hovered === doc.id ? 20 : 10, // Bring the hovered document to the front
                transform: hovered === null ? "scale(0.9)" : "scale(1)", // Slightly scale down when overlapped
                transition:
                  " delay 0.8s ease, left 0.3s ease, transform 0.3s ease, opacity 0.3s ease", // Smooth transition for movement
              }}
              onMouseEnter={() => setHovered(index)} // Show the stack when hovering over any document
              onMouseLeave={() => setHovered(null)} // Return to the stack after mouse leave
              onClick={() => openModal(doc)} // Simulate opening the document
            >
              <p className="text-sm font-medium truncate">
                {doc.original_filename}
              </p>
              <iframe
                src={doc.url}
                title={doc.original_filename}
                className="w-full h-24 rounded pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedFile && (
          <div className="w-screen">
            <h2 className="text-xl font-bold my-4">
              {selectedFile.original_filename}
            </h2>
            {selectedFile.url ? (
              <div className="w-screen h-full">
                <iframe
                  src={selectedFile.url}
                  // src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedFile.url)}&embedded=true`}
                  className="w-[700px] h-screen "
                />
              </div>
            ) : (
              <p>No preview available.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Viewer;