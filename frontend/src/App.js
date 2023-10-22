import React , {useEffect} from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { auth, firebase } from './firebase';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import AdminHome from './components/Admin/AdminHome/AdminHome';
import UserHome from './components/User/UserHome/UserHome';
import AuthListener from "./components/Utils/AuthListener"
import Records from './components/Admin/Records/Records';

function ProtectedRoute({ element, adminRequired }) {
  if (adminRequired && auth.currentUser && auth.currentUser.email === 'adminmaps@gmail.com') {
    return element;
  } else if (!adminRequired && auth.currentUser) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
}

function App() {
  // useEffect(() => {
  //   // Trigger the Google Translate widget when the component mounts
  //   if (window.googleTranslateElementInit) {
  //     window.googleTranslateElementInit();
  //   }
  // }, []);
  return (
    <div className="App">
      <div id="google_translate_element"></div>
      <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminHome />} adminRequired={true} />} />
        <Route path="/admin/records" element={<ProtectedRoute element={<Records/>} adminRequired={false} />} />
        <Route path="/user" element={<ProtectedRoute element={<UserHome />} adminRequired={false} />} />
      </Routes>
    </div>
  );
}

export default App;
