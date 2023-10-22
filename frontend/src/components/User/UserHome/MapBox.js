
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TuneIcon from '@mui/icons-material/Tune';
import "./MapBox.css";
import Alert from '@mui/material/Alert';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import AlertTitle from '@mui/material/AlertTitle';
const alertstyle = {
  width: '100%',
  maxWidth: '700px',
  padding: '16px',
  border: '1px solid orange',
  borderRadius: '4px',
  margin: '0 auto',
  marginTop: '10px',
  marginBottom: '15px',
}

mapboxgl.accessToken = 'pk.eyJ1IjoibmFhdXNlcm5hbWUiLCJhIjoiY2xucXcwY2k4MGw0eDJqbXdoOHI2NGVmdiJ9.IYNH8EDXyXv02EtbOhiOEA';

export default function MapBox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-97.1526);
  const [lat, setLat] = useState(33.2075);
  const [zoom, setZoom] = useState(15);
  const userMarker = useRef(null);
  const restroomMarkers = useRef({});
  const directionsRef = useRef(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);

  const [formDatas, setFormDatas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recordsVisible, setRecordsVisible] = useState(false);
  const [mapLanguage, setMapLanguage] = useState('en');
  const [language, setLanguage] = useState('en');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  // const [anchor, setAnchor] = React.useState(null);
  const [anchor, setAnchor] = React.useState(null);
  const [handicapAvailable, setHandicapAvailable] = React.useState(false);
  const [babyChangingStationAvailable, setBabyChangingStationAvailable] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  
  
  

  const open = Boolean(anchor);
  const id = open ? 'simple-popup' : undefined;


  const fetchPost = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "pins"));
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFormDatas(newData);
      renderRestroomMarkers(newData);
      console.log(newData);
      console.log(formDatas);
      newData.forEach((restroom, index) => {
        const { name, coordinates, image, available } = restroom;
        const marker = new mapboxgl.Marker()
          .setLngLat(coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`<style>
          .mapboxgl-popup {
            max-width: 160px;
            max-height: 160px;
          }
          
          /* Style for the image carousel container */
          .image-carousel {
            display: flex;
            overflow: hidden;
          }
          
          /* Style for individual carousel slides (images) */
          .carousel-slide img{
            height:100px;
            width:100px;
          }
          </style><h3>${name}</h3><div class="image-carousel">
          <div class="carousel-slide">
          <a href="${image}" style="text-decoration:none;">
            <img src="${image}" alt="Image 1">
            </a>
            </div>
        </div><p>${available}</p>`))
          .addTo(map.current);

        marker.getElement().addEventListener('click', () => {
          setSelectedRestroom(restroom);
        });

        restroomMarkers.current[index] = marker;
        const fdata = newData;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchPost();
  }, [])

  const renderRestroomMarkers = (data) => {
    Object.values(restroomMarkers.current).forEach((marker) => {
      marker.remove();
    });

    data.forEach((restroom, index) => {
      const { name, coordinates, image, available } = restroom;
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<style>
          .mapboxgl-popup {
            max-width: 160px;
            max-height: 160px;
          }
          
          /* Style for the image carousel container */
          .image-carousel {
            display: flex;
            overflow: hidden;
          }
          
          /* Style for individual carousel slides (images) */
          .carousel-slide img{
            height:100px;
            width:100px;
          }
          </style><h3>${name}</h3><div class="image-carousel">
          <div class="carousel-slide">
          <a href="${image}" style="text-decoration:none;">
            <img src="${image}" alt="Image 1">
            </a>
            </div>
        </div><p>${available}</p>`))
        .addTo(map.current);

      marker.getElement().addEventListener('click', () => {
        setSelectedRestroom(restroom);
      });

      restroomMarkers.current[index] = marker;
    });
  };

  const handleSubmit = () => {
    // Create a filter object based on the selected filter criteria
    const filters = {
      handicapAvailable,
      babyChangingStationAvailable,
      rating,
    };

    // Filter the restroom data based on the selected filters
    const filteredRestrooms = formDatas.filter((restroom) => {
      // Check if the restroom meets the handicap availability filter
      if (filters.handicapAvailable && !restroom.handicap) {
        return false;
      }

      // Check if the restroom meets the baby changing station availability filter
      if (filters.babyChangingStationAvailable && !restroom.babyChangingStation) {
        return false;
      }

      // Check if the restroom's rating is not equal to the selected rating
      if (filters.rating > 0 && restroom.rating !== filters.rating + 1) {
        return false;
      }

      return true;
    });

    renderRestroomMarkers(filteredRestrooms);
    setAnchor(null);
  };


  const [selectedRestroom, setSelectedRestroom] = useState(null);
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setMapLanguage(selectedLanguage);
  };


  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/streets-v12?language=${language}`,
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });


    directionsRef.current = new MapboxDirections({
      accessToken: 'pk.eyJ1IjoibmFhdXNlcm5hbWUiLCJhIjoiY2xucXcwY2k4MGw0eDJqbXdoOHI2NGVmdiJ9.IYNH8EDXyXv02EtbOhiOEA',
    });

    map.current.addControl(directionsRef.current, 'top-left');

    directionsRef.current.on('route', (event) => {
      const route = event.route[0];
      const distance = (route.distance / 1609.344).toFixed(2); // Convert meters to miles
      const duration = (route.duration / 60).toFixed(2); // Convert seconds to minutes
      alert(`Distance: ${distance} miles, Duration: ${duration} minutes`);
    });
    const buttons = document.querySelectorAll('.button');
    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const newLanguage = event.target.id.substr('button-'.length);
        setLanguage(newLanguage);
        // map.setStyle(`mapbox://styles/mapbox/light-v11?language=${newLanguage}`);
        map.current = new mapboxgl.Map({
          style: `mapbox://styles/mapbox/light-v12?language=${newLanguage}`,
        });
      });
    });
  }, [lng, lat, language]);





  const zoomIn = () => {
    const currentZoom = map.current.getZoom();
    if (currentZoom < 20) {
      map.current.zoomTo(currentZoom + 1);
    }
  };

  const zoomOut = () => {
    const currentZoom = map.current.getZoom();
    if (currentZoom > 1) {
      map.current.zoomTo(currentZoom - 1);
    }
  };

  const fiterMethod = () => {

  }

  const showUserLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.current.flyTo({ center: [longitude, latitude], zoom: 14 });

      if (!userMarker.current) {
        userMarker.current = new mapboxgl.Marker({ color: 'blue' })
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      } else {
        userMarker.current.setLngLat([longitude, latitude]);
      }
    });
  };

  const resetMap = () => {
    map.current.flyTo({ center: [-97.1526, 33.2075], zoom: 15 });

    if (userMarker.current) {
      userMarker.current.remove();
    }
  };

  const calculateRoute = () => {
    // Calculate a walking route from the default location to the selected location
    directionsRef.current.setOrigin([-97.1526, 33.2075]);
    directionsRef.current.setDestination([selectedRestroom.coordinates[0], selectedRestroom.coordinates[1]]);
  };

  const handleSearchLocation = () => {
    // Use the Mapbox Geocoding API to search for the entered location
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchLocation}.json?access_token=${mapboxgl.accessToken}`)
      .then((response) => response.json())
      .then((data) => {
        // Extract search results from the API response
        const results = data.features;

        // Update the search results state
        setSearchResults(results);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Use the Mapbox Geocoding API to get autocomplete suggestions
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=pk.eyJ1IjoibmFhdXNlcm5hbWUiLCJhIjoiY2xucXcwY2k4MGw0eDJqbXdoOHI2NGVmdiJ9.IYNH8EDXyXv02EtbOhiOEA`)
      .then((response) => response.json())
      .then((data) => {
        // Extract and set the suggestions from the API response
        const results = data.features.map((feature) => feature.place_name);
        setAutocompleteSuggestions(results);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Get the search query from the input field
    const query = searchQuery.trim();

    if (query === '') {
      // Handle empty search query (e.g., show a message to the user)
      console.log('Please enter a location or landmark.');
      return;
    }

    // Use the Mapbox Geocoding API to search for the entered location
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=pk.eyJ1IjoibmFhdXNlcm5hbWUiLCJhIjoiY2xucXcwY2k4MGw0eDJqbXdoOHI2NGVmdiJ9.IYNH8EDXyXv02EtbOhiOEA`)
      .then((response) => response.json())
      .then((data) => {
        // Extract search results from the API response
        const results = data.features;

        if (results.length === 0) {
          // Handle no results found (e.g., show a message to the user)
          console.log('No results found for the entered location.');
          return;
        }

        // Extract the first result as the selected location
        const selectedLocation = results[0];
        const { center, place_name } = selectedLocation;

        // Center the map on the selected location
        map.current.flyTo({ center, zoom: 14 });

        // Create a marker for the selected location
        const marker = new mapboxgl.Marker()
          .setLngLat(center)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${place_name}</h3>`))
          .addTo(map.current);


        setSearchQuery('');

        // You can add more code here to customize how the search result is displayed on the map.
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleAutocompleteSelection = (suggestion) => {
    setSearchLocation(suggestion);
    setSearchQuery(suggestion);
    setSearchResults([]);// Update the input field with the selected suggestion
  };



  return (
    <div>

      {/* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */}

      <Alert severity="warning" style={alertstyle}>
        <AlertTitle>Info</AlertTitle>
        Type Near in the text field and click on Submit  <strong>to Get nearest RestRooms</strong>
      </Alert>
      <form onSubmit={handleSearchSubmit}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a location or landmark"
            value={searchQuery}
            onChange={handleSearchInputChange}
            ref={searchInputRef}
          />

          <button type="submit">Search</button>
        </div>
      </form>
      <ul>
        {autocompleteSuggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleAutocompleteSelection(suggestion)} style={{ cursor: 'pointer' }}>
            {suggestion}
          </li>
        ))}
      </ul>

      <div ref={mapContainer} className="map-container" />
      {/* <ul id="buttons">
        <li id="button-en" className="button">English</li>
        <li id="button-fr" className="button">French</li>
        <li id="button-ru" className="button">Russian</li>
        <li id="button-de" className="button">German</li>
        <li id="button-es" className="button">Spanish</li>
      </ul> */}

      <div className="map-controls">

        <button onClick={zoomIn}><ZoomInIcon /></button>
        <button onClick={zoomOut}><ZoomOutIcon /></button>
        <button onClick={showUserLocation}><MyLocationIcon /></button>
        <button onClick={resetMap}><RestartAltIcon /></button>
        <button aria-describedby={id} type="button" onClick={handleClick}><TuneIcon /></button>
        <BasePopup id={id} open={open} anchor={anchor}>
        <PopupBody>
        <div>
            <h2>Filters</h2>
            <label>
              <input
                type="checkbox"
                checked={handicapAvailable}
                onChange={() => setHandicapAvailable(!handicapAvailable)}
              />
              Handicap Accessible
            </label>
            <br />
            <label>
              <input
                type="checkbox"
                checked={babyChangingStationAvailable}
                onChange={() => setBabyChangingStationAvailable(!babyChangingStationAvailable)}
              />
              Baby Changing Station
            </label>
            <br />
            <label>
              Rating:
              <select value={rating} onChange={handleRatingChange}>
                <option value="0">1</option>
                <option value="1">2</option>
                <option value="2">3</option>
                <option value="3">4</option>
                <option value="4">5</option>
              </select>
            </label>
            <br />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </PopupBody>
      </BasePopup>
      </div>
      {selectedRestroom && (
        <div className="map-control" style={{ marginTop: '45px' }}>
          <h3>{selectedRestroom.name}</h3>
          <p>Rating : {selectedRestroom.rating} 🌟 / 5</p>
          <p>Availablity : {selectedRestroom.available}</p>
          <p>Baby Changing Station : {selectedRestroom.babyChangingStation}</p>
          <p>Handicap Availablity : {selectedRestroom.handicap}</p>
          <p>{selectedRestroom.descriptionMon}</p>
          <p>{selectedRestroom.descriptionTue}</p>
          <p>{selectedRestroom.descriptionWed}</p>
          <p>{selectedRestroom.descriptionThu}</p>
          <p>{selectedRestroom.descriptionFri}</p>
          <p>{selectedRestroom.descriptionSat}</p>
          <p>{selectedRestroom.descriptionSun}</p>

        </div>
      )}

    </div>
  );
}

const grey = {
  50: '#f6f8fa',
  200: '#d0d7de',
  500: '#6e7781',
  700: '#424a53',
  900: '#24292f',
};

const blue = {
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const PopupBody = styled('div')(
  ({ theme }) => `
  width: 300px; /* Set your desired width */
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? `0px 4px 8px rgba(0, 0, 0, 0.7)`
      : `0px 4px 8px rgba(0, 0, 0, 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 1;

  h2 {
    font-size: 1.25rem;
    margin: 0;
  }

  label {
    display: flex;
    align-items: center;

    input[type="checkbox"] {
      margin-right: 8px;
    }
  }

  select {
    padding: 8px;
  }

  button {
    background-color: ${blue[500]};
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: ${blue[600]};
    }

    &:active {
      background-color: ${blue[700]};
    }
  }
`,
);

const Button = styled('button')`
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  background-color: ${blue[500]};
  color: white;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 150ms ease;
  border: none;

  &:hover {
    background-color: ${blue[600]};
  }

  &:active {
    background-color: ${blue[700]};
  }
`;
