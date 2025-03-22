
import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center bg-opacity-40 min-h-screen fixed inset-0  bg-black">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
    </div>
  );
};

export default Loader;
