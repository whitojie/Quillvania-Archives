import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function LocationDetailPage() {
  const { worldId, locId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [location, setLocation] = useState({ name: "", description: "" });

  const axiosConfig = { headers: { Authorization: `Bearer ${user?.access_token}` } };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/locations/${locId}`, axiosConfig);
        setLocation(res.data);
      } catch (err) {
        console.error("Error fetching location:", err);
      }
    };
    fetchLocation();
  }, [locId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/locations/${locId}`, location, axiosConfig);
      navigate(`/world/${worldId}`);
    } catch (err) {
      console.error("Error saving location:", err);
    }
  };

  return (
    <div className="page-wrapper">
      <h2>Edit Location</h2>
      <form onSubmit={handleSave}>
        <input
          value={location.name}
          onChange={e => setLocation({ ...location, name: e.target.value })}
          placeholder="Location Name"
          required
        />
        <textarea
          value={location.description}
          onChange={e => setLocation({ ...location, description: e.target.value })}
          placeholder="Description"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
