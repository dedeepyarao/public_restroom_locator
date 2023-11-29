import React , {useEffect , useState} from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { auth, firebase } from './firebase';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import AdminHome from './components/Admin/AdminHome/AdminHome';
import UserHome from './components/User/UserHome/UserHome';
import AuthListener from "./components/Utils/AuthListener"
import Records from './components/Admin/Records/Records';
import Recommendation from './components/User/UserHome/Recommendation';
import Search from './components/User/UserHome/Search';
import Filter from './components/User/UserHome/Filter';
import Qrcode from './components/User/UserHome/Qrcode';
import Qrcodeone from './components/User/UserHome/Qrcodeone';
import Qrcodetwo from './components/User/UserHome/Qrcodetwo';
import Qrcodethree from './components/User/UserHome/Qrcodethree';
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
        <Route path="/recommendations" element={<Recommendation/>}  />
        <Route path="/filters" element={<Filter/>} />
        <Route path="/search" element={<Search/>} />
        <Route path="/qrs" element={<Qrcode />} />
        <Route path="/qrs/1" element={<Qrcodeone />} />
        <Route path="/qrs/2" element={<Qrcodetwo />} />
        <Route path="/qrs/3" element={<Qrcodethree />} />
      </Routes>
    </div>
  );
}

export default App;
