import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import MapContainer from './components/Map/Map';
import DialogBox from './components/utils/DialogBox';

function App() {
  const [coordinates, setCoordinates] = useState([]);
  const [newData, setNewData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [canStimulate, setCanStimulate] = useState(false); // Track whether new coordinates have been added

  const handleInputSubmit = (coordinatesToAdd) => {
    setNewData(coordinatesToAdd);
    setIsDialogOpen(false);
    setCanStimulate(true); // Enable the "Simulate" button after new coordinates are added
    toast.success('New data added! Click "Simulate" to see changes.');
  };

  const handleSimulate = () => {
    if (!canStimulate) {
      console.log("here ");
      toast.warning('Please add new data for stimulation or refresh the page.');
      return;
    }
    setIsSimulating(true);
    setCoordinates([...coordinates, ...newData.map((ele) => [ele.latitude, ele.longitude])]);
    setNewData([]);
    setCanStimulate(false); // Disable the "Simulate" button after simulating
    toast.success('Click on Play Button to Play/Pause  to Perform Actions')
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <div className="App">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      <DialogBox isOpen={isDialogOpen} onClose={toggleDialog} onSubmit={handleInputSubmit} />
      <button onClick={toggleDialog} className="absolute top-3 right-20 z-10 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
        Add
      </button>
      <button onClick={handleSimulate} className="absolute top-3 right-40 z-10 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
        Simulate
      </button>
      <MapContainer coordinates={coordinates} isSimulating={isSimulating} onStimulate={handleSimulate} />
    </div>
  );
}

export default App;
