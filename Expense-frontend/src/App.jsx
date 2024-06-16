import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginAndSignup from './Components/LoginandSignup';
import Home from './Components/Home';
import ForgotPasswordForm from './Components/ForgotPasswordForm';
import ResetPasswordForm from './Components/ResetPasswordForm'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAndSignup />} />
        <Route path="/home" element={localStorage.getItem('token') ? <Home /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} /> 
      <Route path="/reset-password/:token" element={<ResetPasswordForm />}/>
      </Routes>
    </Router>
  );
};

export default App;
