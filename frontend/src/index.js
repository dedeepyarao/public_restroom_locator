import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import AuthListener from "./components/Utils/AuthListener"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    {/* <AuthListener> */}
    
    <App />
    {/* </AuthListener> */}
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
