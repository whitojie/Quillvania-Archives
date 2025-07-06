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
    <div className="page-wrapper">
      <div className="header-wrapper">
        <h1 className="main-title">Join Quillvania</h1>
        <h2 className="subtitle">Begin your writing adventure</h2>
      </div>

      <div className="login-container">
        <form onSubmit={handleSubmit} className="auth-form">
          
          <div className="input-row">
            <div className="input-group half">
              <label>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="input-group half">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group half">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="input-group half">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-button">Register</button>

          {message && <p className="error-message">{message}</p>}

          <p className="auth-alternate-action">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
