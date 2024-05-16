import React, { useState } from 'react';
import './App.css';
import MapContainer from './components/Map/Map';
import DialogBox from './components/utils/DialogBox';

function App() {
  const [coordinates, setCoordinates] = useState([
    [30.67707920758048, 76.72407150381622],
    [30.678217564150145, 76.72351811986506],
    [30.67808449089114, 76.72363567850437]
  ]);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputSubmit = (coordinatesToAdd) => {
    // Extract latitude and longitude from each object in the array and append them to the coordinates array
    const newCoordinates = coordinatesToAdd.map(({ latitude, longitude }) => [
      parseFloat(latitude),
      parseFloat(longitude)
    ]);
    
    setCoordinates([...coordinates, ...newCoordinates]);
    setIsDialogOpen(false); // Close the dialog box after submitting coordinates
  };
  

  const handleSimulate = () => {
    setIsSimulating(true);
    // Simulate drone movement here
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <div className="App">
      <DialogBox isOpen={isDialogOpen} onClose={toggleDialog} onSubmit={handleInputSubmit} />
      <button onClick={toggleDialog} className="absolute top-3 right-20 z-10 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
        Add
      </button>
      <button onClick={handleSimulate} className="absolute top-3 right-72 z-10 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
        Simulate
      </button>
      <MapContainer coordinates={coordinates} isSimulating={isSimulating} />
    </div>
  );
}

export default App;
