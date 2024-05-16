import React, { useState } from 'react';

const InputForm = ({ onSubmit }) => {
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [fileData, setFileData] = useState(null);
  const [time, setTime] = useState('');

  const handleManualSubmit = () => {
    const latitude = parseFloat(manualLatitude);
    const longitude = parseFloat(manualLongitude);
    if (!isNaN(latitude) && !isNaN(longitude) && time !== '') {
      // Concatenate the time with the current date to form a complete date-time string
      const currentTime = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      const timestamp = new Date(`${currentTime}T${time}`).toISOString();
      onSubmit([{ latitude, longitude, timestamp }]);
      setManualLatitude('');
      setManualLongitude('');
      setTime('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileData(JSON.parse(event.target.result));
      };
      reader.readAsText(file);
    }
  };

  const handleFileSubmit = () => {
    if (fileData) {
      const parsedData = fileData.map(({ latitude, longitude, timestamp }) => ({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timestamp,
      }));
      onSubmit(parsedData);
      setFileData(null);
      setSelectedFileName('');
    }
  };
;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manualLatitude">
          Manual Latitude:
        </label>
        <input
          id="manualLatitude"
          type="text"
          value={manualLatitude}
          onChange={(e) => setManualLatitude(e.target.value)}
          className="w-full px-3 py-2 placeholder-gray-300 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
          placeholder="Enter latitude..."
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="manualLongitude">
          Manual Longitude:
        </label>
        <input
          id="manualLongitude"
          type="text"
          value={manualLongitude}
          onChange={(e) => setManualLongitude(e.target.value)}
          className="w-full px-3 py-2 placeholder-gray-300 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
          placeholder="Enter longitude..."
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
          Time:
        </label>
        <input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-3 py-2 placeholder-gray-300 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
        />
      </div>
      <button
        onClick={handleManualSubmit}
        className="w-full mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
      >
        Submit Manual Input
      </button>
      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileInput">
          Upload File (comma-separated):
        </label>
        <label
          htmlFor="fileInput"
          className="block w-full px-4 py-2 bg-white text-indigo-500 rounded-md border border-indigo-500 cursor-pointer hover:bg-indigo-500 hover:text-white"
        >
          {selectedFileName ? selectedFileName : 'Choose a file'}
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      {fileData && (
        <button
          onClick={handleFileSubmit}
          className="w-full mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
        >
          Submit File Data
        </button>
      )}
    </div>
  );
};

export default InputForm;
