import React from 'react';

const Loader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-8"></div>
      <p className="text-gray-700 text-xl font-semibold">
        Loading, please wait...
      </p>
    </div>
  );
};

export default Loader;
