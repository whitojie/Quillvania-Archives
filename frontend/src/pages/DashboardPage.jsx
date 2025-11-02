import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("DashboardPage mounted");
  console.log("User object:", user);
  if (!user) {
    navigate("/login"); // redirect immediately if somehow route is hit
    return null; // don't render anything
  }

  const [worlds, setWorlds] = useState([]);
  const [newWorld, setNewWorld] = useState({ name: "", description: "" });
  const [activeWorld, setActiveWorld] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);

  // Axios config with auth header
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${user?.access_token}`,
    },
  };

  // Fetch all worlds
  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/worlds/`, axiosConfig);
        setWorlds(res.data);
      } catch (err) {
        console.error("Error fetching worlds:", err);
      }
    };
    fetchWorlds();
  }, []);

  // Create a world
  const handleCreateWorld = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/worlds/`, newWorld, axiosConfig);
      setWorlds([...worlds, res.data]);
      setNewWorld({ name: "", description: "" });
    } catch (err) {
      console.error("Error creating world:", err);
    }
  };

  // Delete a world
  const handleDeleteWorld = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/worlds/${id}`, axiosConfig);
      setWorlds(worlds.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Error deleting world:", err);
    }
  };

  // Open a world — load its data
  const handleOpenWorld = async (world) => {
    setActiveWorld(world);
    try {
      const [chars, evts, locs] = await Promise.all([
        axios.get(`${API_BASE_URL}/characters/world/${world.id}`, axiosConfig),
        axios.get(`${API_BASE_URL}/events/world/${world.id}`, axiosConfig),
        axios.get(`${API_BASE_URL}/locations/world/${world.id}`, axiosConfig),
      ]);
      setCharacters(chars.data);
      setEvents(evts.data);
      setLocations(locs.data);
    } catch (err) {
      console.error("Error loading world data:", err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Welcome to Quillvania, {user?.username || "Writer"}!</h2>
        <button onClick={handleLogout} className="auth-button logout">Log out</button>

        {/* ---------- WORLD CREATION ---------- */}
        <form onSubmit={handleCreateWorld} className="world-form">
          <h3>Create a New World</h3>
          <input
            type="text"
            placeholder="World name"
            value={newWorld.name}
            onChange={(e) => setNewWorld({ ...newWorld, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newWorld.description}
            onChange={(e) => setNewWorld({ ...newWorld, description: e.target.value })}
          />
          <button type="submit" className="auth-button">Create</button>
        </form>

        {/* ---------- WORLD LIST ---------- */}
        <div className="world-list">
          <h3>Your Worlds</h3>
          {worlds.length === 0 && <p>No worlds yet. Create one above!</p>}
          {worlds.map((w) => (
            <div key={w.id} className="world-item">
              <div>
                <strong>{w.name}</strong>
                <p>{w.description}</p>
              </div>
              <div className="world-buttons">
                <button onClick={() => handleOpenWorld(w)} className="auth-button">Open</button>
                <button onClick={() => handleDeleteWorld(w.id)} className="delete-button">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- ACTIVE WORLD DETAILS ---------- */}
        {activeWorld && (
          <div className="active-world">
            <h3>🌍 {activeWorld.name}</h3>
            <p>{activeWorld.description}</p>

            <div className="world-sections">
              <div>
                <h4>Characters</h4>
                {characters.length === 0 ? <p>No characters yet.</p> : characters.map(c => (
                  <p key={c.id}>{c.name}: {c.description}</p>
                ))}
              </div>

              <div>
                <h4>Events</h4>
                {events.length === 0 ? <p>No events yet.</p> : events.map(e => (
                  <p key={e.id}>{e.name}: {e.description}</p>
                ))}
              </div>

              <div>
                <h4>Locations</h4>
                {locations.length === 0 ? <p>No locations yet.</p> : locations.map(l => (
                  <p key={l.id}>{l.name}: {l.description}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default DashboardPage;
