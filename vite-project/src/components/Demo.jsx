import React, { useState } from 'react';

export default function Demo() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8">Demo Upload Page</h1>
      
      {/* Styled upload button */}
      <label className="relative inline-block px-6 py-3 font-medium group">
        <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform -translate-x-1 -translate-y-1 bg-blue-500 group-hover:translate-x-0 group-hover:translate-y-0"></span>
        <span className="relative text-white">Upload File</span>
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </label>

      {selectedFile && (
        <div className="mt-4">
          <p className="text-lg text-gray-700">Selected File: {selectedFile.name}</p>
        </div>
      )}
    </div>
  );
}
