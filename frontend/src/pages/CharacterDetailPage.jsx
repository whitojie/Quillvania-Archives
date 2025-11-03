import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function CharacterDetailPage() {
  const { worldId, charId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({ name: "", description: "", role: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Create axios instance with interceptors to handle redirects
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${user?.access_token}`,
      'Content-Type': 'application/json'
    }
  });

  // Check authentication
  useEffect(() => {
    if (!user?.access_token) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Fetch character if editing
  useEffect(() => {
    if (!charId) return;

    const fetchCharacter = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/characters/${charId}`);
        setFormData({
          name: res.data.name,
          description: res.data.description,
          role: res.data.role,
        });
        setMessage("");
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.response?.status === 401) {
          setMessage("Authentication failed. Please login again.");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          setMessage(err.response?.data?.detail || "Failed to load character.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [charId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (charId) {
        // Edit existing character
        await api.put(`/characters/${charId}`, formData);
        setMessage("Character updated successfully!");
      } else {
        // Create new character - WITHOUT world_id in body
        await api.post(`/characters/world/${worldId}`, formData);
        setMessage("Character created successfully!");
        setTimeout(() => navigate(`/world/${worldId}`), 1000);
      }
    } catch (err) {
      console.error("Submit error:", err);
      if (err.response?.status === 401) {
        setMessage("Authentication failed. Please login again.");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (err.response?.status === 422) {
        // Show validation errors
        const errors = err.response.data.detail;
        if (Array.isArray(errors)) {
          const errorMessages = errors.map(error => `${error.loc[1]}: ${error.msg}`).join(', ');
          setMessage(`Validation errors: ${errorMessages}`);
        } else {
          setMessage("Validation error: Please check your input data.");
        }
      } else {
        setMessage(err.response?.data?.detail || "Operation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!charId) return;
    if (!window.confirm("Are you sure you want to delete this character?")) return;

    setLoading(true);
    try {
      await api.delete(`/characters/${charId}`);
      navigate(`/world/${worldId}`);
    } catch (err) {
      console.error("Delete error:", err);
      if (err.response?.status === 401) {
        setMessage("Authentication failed. Please login again.");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setMessage(err.response?.data?.detail || "Delete failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && charId) {
    return <div className="page-wrapper">Loading character...</div>;
  }

  return (
    <div className="page-wrapper">
      <Link to={`/world/${worldId}`}>&larr; Back to World</Link>
      <h2>{charId ? "Edit Character" : "Create Character"}</h2>
      
      {message && (
        <p className={message.includes("successfully") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="world-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Character name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input
            id="role"
            type="text"
            name="role"
            placeholder="Character role (e.g., Hero, Villain, Merchant)"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Character description, backstory, personality..."
            value={formData.description}
            onChange={handleChange}
            rows="6"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? "Saving..." : (charId ? "Save Changes" : "Create Character")}
          </button>
          
          {charId && (
            <button 
              type="button" 
              onClick={handleDelete} 
              disabled={loading}
              className="delete-button"
            >
              {loading ? "Deleting..." : "Delete Character"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}