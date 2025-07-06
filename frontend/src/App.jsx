import React, { useState } from "react";
import axios from "axios";
import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";


const API_BASE_URL = "http://localhost:8000"; // Change this if backend is on a different host


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  );
}

export default App;
