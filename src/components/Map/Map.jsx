import React, { useEffect, useState, useRef } from 'react';
import { Map, Marker, Polyline, GoogleApiWrapper } from 'google-maps-react';
import { GOOGLE_API_KEY } from '../../utils/constants';
import droneIcon from '../../assets/icons/done.png';

const MapContainer = ({ google, coordinates, isSimulating }) => {
  const [progress, setProgress] = useState([]);
  const [lastReachedIndex, setLastReachedIndex] = useState(0); // Store the index of the last reached location
  const velocity = 15; // Adjust velocity as needed
  const initialDate = useRef(new Date());
  const intervalIdRef = useRef(null);
  const mapRef = useRef(null); // Reference to the map instance
  const [initialCenter, setInitialCenter] = useState(getCoordinate());
  const [isPlaying, setIsPlaying] = useState(false); // Initially set to false
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setInitialCenter(getCoordinate())
  }, [coordinates])
  useEffect(() => {
    if (isSimulating && coordinates.length > 0 && google && google.maps.geometry) {
      if (!isPaused) {
        intervalIdRef.current = setInterval(moveObject, 1000); // Update every second
        setIsPlaying(true); // Set to true when simulation starts
      }
      return () => clearInterval(intervalIdRef.current);
    } else {
      setIsPlaying(false); // Set to false when simulation stops
    }

    setInitialCenter(getCoordinate())
  }, [isSimulating, coordinates, google, isPaused]); // Include coordinates, google, and isPaused as dependencies

  useEffect(() => {
    // Preserve the progress made so far when new coordinates are added
    setProgress((prevProgress) => {
      // Only preserve progress if there's no existing progress or the last coordinate hasn't been reached yet
      return lastReachedIndex !== coordinates.length - 1 ? prevProgress : progress;
    });
    setLastReachedIndex(0); // Reset last reached index
  }, [coordinates.length]);

  const moveObject = () => {
    if (lastReachedIndex === coordinates.length - 1) {
      clearInterval(intervalIdRef.current); // Clear interval if the last coordinate is reached
      setIsPlaying(false);
      return; // Stop moving
    }

    const distance = getDistance(initialDate.current, velocity); // Calculate distance
    const newPosition = calculatePosition(distance);



    // Check if the newPosition is approximately the same as the last coordinate
    const lastCoordinate = coordinates[coordinates.length - 1];
    if (Math.abs(newPosition.lat - lastCoordinate[0]) < 1e-6 && Math.abs(newPosition.lng - lastCoordinate[1]) < 1e-6) {
      clearInterval(intervalIdRef.current); // Clear interval if the last coordinate is reached
      setIsPlaying(false);
      return; // Stop moving
    }

    // Update progress
    setProgress((prevProgress) => [...prevProgress, newPosition]);
    setInitialCenter(newPosition);
  };

  const getDistance = (initialDate, velocity) => {
    const differentInTime = (new Date() - initialDate) / 1000;
    return differentInTime * velocity;
  };

  function getCoordinate() {
    if (coordinates.length <= 0) {
      return { lat: 30.67707920758048, lng: 77.209 }
    }
    else {
      return (progress.length > 0) ? progress[progress.length - 1] : { lat: coordinates[coordinates.length - 1][0], lng: coordinates[coordinates.length - 1][1] }
    }
  }

  const calculatePosition = (distance) => {
    if (!google || !google.maps.geometry) {
      return { lat: coordinates[coordinates.length - 1][0], lng: coordinates[coordinates.length - 1][1] };
    }

    let accumulatedDistance = 0;
    for (let i = lastReachedIndex; i < coordinates.length - 1; i++) {
      const coord1 = { lat: coordinates[i][0], lng: coordinates[i][1] };
      const coord2 = { lat: coordinates[i + 1][0], lng: coordinates[i + 1][1] };
      const segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(coord1),
        new google.maps.LatLng(coord2)
      );

      if (accumulatedDistance + segmentDistance >= distance) {
        const heading = google.maps.geometry.spherical.computeHeading(
          new google.maps.LatLng(coord1),
          new google.maps.LatLng(coord2)
        );
        const remainingDistance = distance - accumulatedDistance;
        const position = google.maps.geometry.spherical.computeOffset(
          new google.maps.LatLng(coord1),
          remainingDistance,
          heading
        );
        setLastReachedIndex(i); // Update lastReachedIndex
        return { lat: position.lat(), lng: position.lng() };
      }
      accumulatedDistance += segmentDistance;
    }

    // If distance exceeds total route distance, return the last coordinate
    return { lat: coordinates[coordinates.length - 1][0], lng: coordinates[coordinates.length - 1][1] };
  };

  const handlePause = () => {
    clearInterval(intervalIdRef.current);
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handlePlay = () => {
    initialDate.current = new Date();
    intervalIdRef.current = setInterval(moveObject, 1000);
    setIsPlaying(true);
    setIsPaused(false);
  };

  return (
    <div>
      {isSimulating && ( // Show buttons only when simulation is active
        <div>
          <button onClick={isPlaying ? handlePause : handlePlay} className="absolute top-20 right-40 z-10 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"> {isPlaying ? 'Pause' : 'Play'}</button>

        </div>
      )}
      <Map
        google={google}
        zoom={18}
        initialCenter={{ ...initialCenter }}
        ref={mapRef}
        center={initialCenter}
      >
        {/* Custom icon for the last coordinate */}
        {coordinates.length > 0 && progress.length > 0 && (
          <Marker
            position={progress[progress.length - 1]}
            icon={{
              url: droneIcon,
              scaledSize: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(15, 15)
            }}
          />
        )}
        {/* Polyline */}
        {coordinates.length > 0 && progress.length > 0 && (
          <Polyline
            path={progress}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2
            }}
          />
        )}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY,
  libraries: ['geometry'] // Ensure the geometry library is loaded
})(MapContainer);
