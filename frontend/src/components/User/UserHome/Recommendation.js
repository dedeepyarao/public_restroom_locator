import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from "../../../firebase";
import "./Recommendation.css";

mapboxgl.accessToken = 'pk.eyJ1IjoibmFhdXNlcm5hbWUiLCJhIjoiY2xucXcwY2k4MGw0eDJqbXdoOHI2NGVmdiJ9.IYNH8EDXyXv02EtbOhiOEA';

const Recommendation = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [recommendEnabled, setRecommendEnabled] = useState(false);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 12
    });
  }, []);

  

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setUserLocation([longitude, latitude]);
      map.current.flyTo({ center: [longitude, latitude] });
      new mapboxgl.Marker({ color: 'green' }).setLngLat([longitude, latitude]).addTo(map.current);
      setRecommendEnabled(true);
    }, () => {
      console.error("Error in getting your location");
    });
  };

  const fetchNearbyPlaces = async () => {
    if (!userLocation) return;
  
    try {
      // Fetching data from Firebase
      const querySnapshot = await getDocs(collection(db, "pins")); 
      const firebaseData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // console.log(data)
        // Convert latitude and longitude to numbers
        return {
          ...data,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude)
        };
      });
  
      // Filter Firebase data based on proximity to userLocation
      const proximityThreshold = 10000; 
      
      const nearbyPlacesFromFirebase = firebaseData.filter(place => {
        const distance = calculateDistance(userLocation[0], userLocation[1], place.coordinates[0], place.coordinates[1]);
        // console.log(distance);
        console.log(userLocation[0],userLocation[1]);
        console.log(typeof(place.coordinates[0]))
        // console.log(place.latitude)
        return distance <= proximityThreshold;
      });
      console.log(firebaseData);
  
      // Fetching additional places from Mapbox API
      const [longitude, latitude] = userLocation;
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/restaurant.json?proximity=${longitude},${latitude}&access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
      const nearbyPlacesFromAPI = '';
  
      // Combine places from Firebase and API
      const combinedPlaces = [...nearbyPlacesFromFirebase, ...nearbyPlacesFromAPI];
  
      setPlaces(combinedPlaces);
  
      // Adding markers for these places on the map
      combinedPlaces.forEach(place => {
        new mapboxgl.Marker()
          .setLngLat(place.coordinates || place.geometry.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(place.name || place.text))
          .addTo(map.current);
      });
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };
  
  // Utility function to calculate distance between two coordinates
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
  
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
  
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in meters
  }
  
  

  return (
    <div>
    <div className='container'>
      <button onClick={getLocation} className="button">Get Location</button>
      <button onClick={fetchNearbyPlaces} disabled={!recommendEnabled} className="button">Recommend</button>
      <div ref={mapContainer} style={{ height: '400px', width: '80%' , marginLeft: '40px'}}  className="map-container"/>

      <div>
        {places.map((place, index) => (
          <div key={index} className="place-card">
            {/* <h3>{place.text}</h3> */}
            {/* <p>Coordinates: {place.geometry.coordinates.join(', ')}</p> */}
            <img src={`${place.image}`} className="place-image" />
            <h3>{place.name}</h3>
            <h5>Longitude : {place.coordinates[0]}</h5>
            <h5>Latitude  : {place.coordinates[1]}</h5>
            <h5>Rating : {place.rating}</h5>
            <h5>Status : {place.available}</h5>
            <h5>Baby Changing Station : {place.babyChangingStation}</h5>
            <h5>Handicap Availability : {place.handicap}</h5>

            {/* Add more details as needed */}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Recommendation;
