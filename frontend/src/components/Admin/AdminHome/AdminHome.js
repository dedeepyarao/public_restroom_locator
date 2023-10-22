import React , {useState , useEffect}from 'react';
import {analytics , firebase , firebaseDb} from "../../../firebase"
import { getAnalytics, logEvent } from "firebase/analytics";
import { onValue } from 'firebase/database';
import { getStorage, ref } from "firebase/storage";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { getAuth, signOut } from 'firebase/auth';
import {useNavigate} from "react-router-dom";
import { Divider } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {db} from "../../../firebase";
import { collection, addDoc , getDocs , doc, deleteDoc ,updateDoc} from "firebase/firestore";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';




const defaultTheme = createTheme();

const formStyle = {
  width: '100%',
  maxWidth: '700px',
  padding: '16px',
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  margin: '0 auto',
};

const alertstyle = {
  width: '100%',
  maxWidth: '700px',
  padding: '16px',
  border: '1px solid skyblue',
  borderRadius: '4px',
  margin: '0 auto',
  marginTop: '10px',
  marginBottom: '15px',
}

const recordsStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  marginTop: '10px',
  marginBottom: '10px',
  padding: '16px',
};

const fieldStyle = {
  marginBottom: '16px',
};

const buttonStyle = {
  marginTop: '16px',
};


function AdminHome() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    longitude:'',
    latitude:'',
    image: '',
    descriptionMon: '',
    descriptionTue: '',
    descriptionWed: '',
    descriptionThu: '',
    descriptionFri: '',
    descriptionSat: '',
    descriptionSun: '',
    available: 'available',
    babyChangingStation: 'Available',
    handicap: 'Yes',
    rating: '1',
  });
  const [formDatas, setFormDatas] = useState([]);
  const [recordsVisible, setRecordsVisible] = useState(false);

  const fetchPost = async () => {
       
    await getDocs(collection(db, "pins"))
        .then((querySnapshot)=>{              
            const newData = querySnapshot.docs
                .map((doc) => ({...doc.data(), id:doc.id }));
            setFormDatas(newData);                
            console.log(newData,formDatas);
        })
   
}

const handleDelete = async (docId) => {
  try {
    const pinDocRef = doc(db, 'pins', docId); // Specify the collection ('pins') and the document ID to delete
    await deleteDoc(pinDocRef); // Delete the document
    alert('Record deleted successfully');
    fetchPost(); // Fetch the updated list of records
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
};

useEffect(()=>{
  fetchPost();
}, [])


  const addTodo = async (e) => {
    e.preventDefault();

    try {
      const coordinates = [parseFloat(formData.longitude), parseFloat(formData.latitude)];
      const data = {
        name: formData.name,
        coordinates: coordinates,
        image: formData.image,
        descriptionMon: formData.descriptionMon,
        descriptionTue: formData.descriptionTue,
        descriptionWed: formData.descriptionWed,
        descriptionThu: formData.descriptionThu,
        descriptionFri: formData.descriptionFri,
        descriptionSat: formData.descriptionSat,
        descriptionSun: formData.descriptionSun,
        available: formData.available,
        babyChangingStation: formData.babyChangingStation,
        handicap: formData.handicap,
        rating: formData.rating,
      };

      const docRef = await addDoc(collection(db, 'pins'), data);
      console.log('Document written with ID: ', docRef.id);
      alert("Data Added Successfully");
      fetchPost();
      setFormData({
        name: '',
        longitude: '',
        latitude: '',
        image: '',
        descriptionMon: '',
        descriptionTue: '',
        descriptionWed: '',
        descriptionThu: '',
        descriptionFri: '',
        descriptionSat: '',
        descriptionSun: '',
        available: 'available',
        babyChangingStation: 'Available',
        handicap: 'Yes',
        rating: '1',
      });
      setRecordsVisible(true);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRecordsClick = () => {
    setRecordsVisible(!recordsVisible);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    
  };
  const handleLogout = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout error', error);
      });
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Rest Room Locator Admin Dashboard
          </Typography>
          <Button onClick={handleLogout} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Welcome to Admin Panel
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
         Here U have complete access to the Website u can add or update and delete the data from here | If your dreams don't scare you, they are too small
        </Typography>
      </Container>
      <Divider style={{fontWeight:'bold'}}>Add Data</Divider>
      <Alert severity="info" style={alertstyle}>
  <AlertTitle>Info</AlertTitle>
  Inside the Monday,Tue,Wed... Text Fields keep the text format as  <strong>Monday: Open 5:30 am, Closes 10:30 pm</strong>
</Alert>

      <form onSubmit={addTodo} style={formStyle} method='POST'>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
      <TextField
        label="Longitude"
        name="longitude"
        value={formData.longitude}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
      <TextField
        label="Latitude"
        name="latitude"
        value={formData.latitude}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
     
      {/* <TextField
        label="Latitude"
        name="coordinates.latitude"
        value={formData.coordinates.latitude}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      /> */}
      <TextField
        label="Image"
        name="image"
        value={formData.image}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
      <TextField
        label="Monday"
        name="descriptionMon"
        value={formData.descriptionMon}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
      <TextField
        label="Tuesday"
        name="descriptionTue"
        value={formData.descriptionTue}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
      <TextField
        label="Wednesday"
        name="descriptionWed"
        value={formData.descriptionWed}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
      <TextField
        label="Thursday"
        name="descriptionThu"
        value={formData.descriptionThu}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
      <TextField
        label="Friday"
        name="descriptionFri"
        value={formData.descriptionFri}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
      <TextField
        label="Saturday"
        name="descriptionSat"
        value={formData.descriptionSat}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
      <TextField
        label="Sunday"
        name="descriptionSun"
        value={formData.descriptionSun}
        onChange={handleInputChange}
        fullWidth
        style={fieldStyle}
      />
      {/* Add similar TextFields for other description fields */}
      <FormControl fullWidth style={fieldStyle}>
        <InputLabel>Available</InputLabel>
        <Select
          name="available"
          value={formData.available}
          onChange={handleInputChange}
        >
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="undermaintenance">Under Maintenance</MenuItem>
          <MenuItem value="notavailable">Not Available</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth style={fieldStyle}>
        <InputLabel>Baby Changing Station</InputLabel>
        <Select
          name="babyChangingStation"
          value={formData.babyChangingStation}
          onChange={handleInputChange}
        >
          <MenuItem value="Available">Available</MenuItem>
          <MenuItem value="Not Available">Not Available</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth style={fieldStyle}>
        <InputLabel>Handicap Access</InputLabel>
        <Select
          name="handicap"
          value={formData.handicap}
          onChange={handleInputChange}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="Not">Not</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth style={fieldStyle}>
        <InputLabel>Rating (out of 5)</InputLabel>
        <Select
          name="rating"
          value={formData.rating}
          onChange={handleInputChange}
          label="Rating"
        >
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="4">4</MenuItem>
          <MenuItem value="5">5</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" style={buttonStyle} fullWidth>
        Submit
      </Button>
    </form>
    <Divider style={{fontWeight:'bold'}}>Previous Records</Divider>
    <Button onClick={handleRecordsClick} variant="contained" color="primary">
        {recordsVisible ? "Hide Records" : "Show Records"}
      </Button>

      {recordsVisible && (
        <div style={recordsStyle}>
          {formDatas.map((data, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Typography variant="h6">{data.name}</Typography>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(data.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ThemeProvider>
  );
}


export default AdminHome;
