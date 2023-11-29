import React, { useRef, useState, useEffect } from 'react'
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import mapboxgl from 'mapbox-gl';
import "./Filter.css"
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxgl.accessToken = 'pk.eyJ1IjoibmFhdXNlcm5hbWUiLCJhIjoiY2xucXcwY2k4MGw0eDJqbXdoOHI2NGVmdiJ9.IYNH8EDXyXv02EtbOhiOEA';

function Filter() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [places, setPlaces] = useState([]);
    const [recommendEnabled, setRecommendEnabled] = useState(false);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
        rating: '',
        babyChangingStation: false,
        handicap: false
    });



    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setUserLocation([longitude, latitude]);
            //console.log(userLocation);
        }, () => {
            console.error("Error in getting your location");
        });
    };

    const fetchNearbyPlaces = async () => {

        try {
            const querySnapshot = await getDocs(collection(db, "pins"));
            const fetchedPlaces = querySnapshot.docs.map(doc => {
                return { ...doc.data(), id: doc.id }; // Include the document ID
            });
            setPlaces(fetchedPlaces);
            setFilteredPlaces(fetchedPlaces);
           
        } catch (error) {
            console.error('Error fetching nearby places:', error);
        }
    };

    useEffect(() => {
        getLocation();
        fetchNearbyPlaces();
    },[userLocation]);

    const applyFilter = () => {
        console.log("Filter Criteria:", filterCriteria);
    
        const filtered = places.filter(place => {
            const meetsRatingCriteria = filterCriteria.rating ? parseInt(place.rating) >= parseInt(filterCriteria.rating) : true;
            console.log("Place Rating:", place.rating, "Meets Rating Criteria:", meetsRatingCriteria);
    
            const meetsBabyChangingCriteria = filterCriteria.babyChangingStation ? place.babyChangingStation : true;
            const meetsHandicapCriteria = filterCriteria.handicap ? place.handicap : true;
    
            return meetsRatingCriteria && meetsBabyChangingCriteria && meetsHandicapCriteria;
        });
    
        console.log("Filtered Places:", filtered);
        setFilteredPlaces(filtered);
        setShowFilter(false);
    };
    
    

    return (
        <div>
            <div style={{alignItems:'center',justifyContent:'center',display:'flex'}}>
                {userLocation && (
                    <div className='user-location'>
                    <h3>User Location: </h3>
                    <h3>Longitude  : {userLocation[0]},</h3>
                    <h3>Latitude :  {userLocation[1]}</h3>
                    </div>
                )}
            </div>
            <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
                <button onClick={() => setShowFilter(true)} style={{ /* ... existing styles ... */ }}>Filter</button>
            </div>
            {showFilter && (
                <div className='filter-modal'>
                    <label>Rating: </label>
                    <input 
                        type="number" 
                        value={filterCriteria.rating} 
                        onChange={e => setFilterCriteria({...filterCriteria, rating: e.target.value})}
                    />
                    <label>Baby Changing Station: </label>
                    <input 
                        type="checkbox" 
                        checked={filterCriteria.babyChangingStation} 
                        onChange={e => setFilterCriteria({...filterCriteria, babyChangingStation: e.target.checked})}
                    />
                    <label>Handicap Availability: </label>
                    <input 
                        type="checkbox" 
                        checked={filterCriteria.handicap} 
                        onChange={e => setFilterCriteria({...filterCriteria, handicap: e.target.checked})}
                    />
                    <button onClick={applyFilter}>Apply Filter</button>
                </div>
            )}
            <div className="places-container">
                {filteredPlaces.map(place => (
                    <div key={place.id} className="place-card">
                        <h3>{place.name}</h3>
                        <h5>Longitude : {place.coordinates[0]}</h5>
                        <h5>Latitude  : {place.coordinates[1]}</h5>
                        <h5>Rating : {place.rating}</h5>
                        <h5>Status : {place.available}</h5>
                        <h5>Baby Changing Station : {place.babyChangingStation}</h5>
                        <h5>Handicap Availability : {place.handicap}</h5>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Filter;