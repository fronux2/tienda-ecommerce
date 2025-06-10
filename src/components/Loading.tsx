import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        
        {/* Texto opcional */}
        <p className="mt-3 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
};

export default Loading;