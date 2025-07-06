import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/login/`, formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/account");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header-wrapper">
        <h1 className="main-title">Quillvania Archives</h1>
        <h2 className="subtitle">Navigate your writing journey</h2>
      </div>

    <div className="login-container">
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="username_or_email">Username or email</label>
          <input
            type="text"
            id="username_or_email"
            value={formData.username_or_email}
            onChange={(e) => setFormData({ ...formData, username_or_email: e.target.value })}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>

        {message && <p className="error-message">{message}</p>}

        <p className="auth-alternate-action">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign up here!
          </Link>
        </p>
      </form>
    </div>
    </div>
  );
}

export default LoginPage;