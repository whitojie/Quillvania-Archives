import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";  // Reusing same CSS file

const API_BASE_URL = "http://127.0.0.1:8000";

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/users/`, formData);
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Registration failed");
    }
  };

return (
    <div className="login-page-wrapper">
      <div className="login-header">
        <h1 className="login-title">Join Quillvania</h1>
        <h2 className="login-subtitle">Begin your writing adventure</h2>
      </div>

      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          {/* Row 1: Username and Full Name */}
          <div className="input-row">
            <div className="input-group half">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required 
              />
            </div>

            <div className="input-group half">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required 
              />
            </div>
          </div>

          {/* Row 2: Email and Password */}
          <div className="input-row">
            <div className="input-group half">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
              />
            </div>

            <div className="input-group half">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required 
              />
            </div>
          </div>

          <button type="submit" className="login-button">Register</button>

          {message && <p className="error-message">{message}</p>}

          <p className="alternate-action">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}


export default SignupPage;