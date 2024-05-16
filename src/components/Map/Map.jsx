// MapContainer.js
import React, { useEffect, useState } from 'react';
import { Map, Marker, Polyline, GoogleApiWrapper } from 'google-maps-react';
import { GOOGLE_API_KEY } from '../../utils/constants';
import droneIcon from '../../assets/icons/done.png'
const MapContainer = ({ google, coordinates, isSimulating }) => {
  const [dronePositionIndex, setDronePositionIndex] = useState(0);

  useEffect(() => {
    if (isSimulating) {
      // Start drone simulation
      const intervalId = setInterval(() => {
        setDronePositionIndex((prevIndex) => {
          if (prevIndex < coordinates.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(intervalId);
            return prevIndex;
          }
        });
      }, 1000); // Update drone position every second
      return () => clearInterval(intervalId);
    }
  }, [coordinates, isSimulating]);

  return (
    <Map google={google} zoom={18} initialCenter={{ lat: coordinates[0][0], lng: coordinates[0][1] }}>
      {/* Markers for all coordinates except the last one */}
      {coordinates.slice(0, -1).map((coord, index) => (
        <Marker
          key={index}
          position={{ lat: coord[0], lng: coord[1] }}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(30, 30),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(5, 5)
          }}
        />
      ))}
      {/* Custom icon for the last coordinate */}
      {coordinates.length > 0 && (
        <Marker
          position={{
            lat: coordinates[coordinates.length - 1][0],
            lng: coordinates[coordinates.length - 1][1]
          }}
          icon={{
            url: droneIcon,
            scaledSize: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 15)
          }}
        />
      )}
      {/* Polyline */}
      <Polyline
        path={coordinates.map(coord => ({ lat: coord[0], lng: coord[1] }))}
        options={{
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2
        }}
      />
    </Map>
  );
};

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY
})(MapContainer);
