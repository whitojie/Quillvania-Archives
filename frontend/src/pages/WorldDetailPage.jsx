import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./WorldDetailPage.css";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function WorldDetailPage() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [world, setWorld] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${user?.access_token}` },
  };

  useEffect(() => {
    const fetchWorldData = async () => {
      try {
        const [charRes, eventRes, locRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/characters/world/${worldId}`, axiosConfig),
          axios.get(`${API_BASE_URL}/events/world/${worldId}`, axiosConfig),
          axios.get(`${API_BASE_URL}/locations/world/${worldId}`, axiosConfig),
        ]);
        setCharacters(charRes.data || []);
        setEvents(eventRes.data || []);
        setLocations(locRes.data || []);
      } catch (err) {
        console.error("Error fetching world data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorldData();
  }, [worldId]);

  if (loading) return <p>Loading world data...</p>;

  return (
    <div className="page-wrapper">
      <Link to="/dashboard" className="back-btn">&larr; Back to Dashboard</Link>

      <div className="world-header">
        <h2>{world?.name || "World Details"}</h2>
        <p>{world?.description || "No description provided."}</p>
      </div>

      {/* Characters Section */}
      <section className="world-section">
        <div className="section-header">
          <h3>Characters</h3>
          <button onClick={() => navigate(`/world/${worldId}/character/new`)}>+ Create Character</button>
        </div>
        {characters.length > 0 ? (
          <ul>
            {characters.map((c) => (
              <li key={c.id}>
                <span>{c.name}</span>
                <div className="actions">
                  <button onClick={() => navigate(`/world/${worldId}/character/${c.id}`)}>Edit</button>
                  <button
                    onClick={async () => {
                      await axios.delete(`${API_BASE_URL}/characters/${c.id}`, axiosConfig);
                      setCharacters(characters.filter((ch) => ch.id !== c.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No characters yet.</p>
        )}
      </section>

      {/* Events Section */}
      <section className="world-section">
        <div className="section-header">
          <h3>Events</h3>
          <button onClick={() => navigate(`/world/${worldId}/event/new`)}>+ Create Event</button>
        </div>
        {events.length > 0 ? (
          <ul>
            {events.map((e) => (
              <li key={e.id}>
                <span>{e.name}</span>
                <div className="actions">
                  <button onClick={() => navigate(`/world/${worldId}/event/${e.id}`)}>Edit</button>
                  <button
                    onClick={async () => {
                      await axios.delete(`${API_BASE_URL}/events/${e.id}`, axiosConfig);
                      setEvents(events.filter((ev) => ev.id !== e.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events yet.</p>
        )}
      </section>

      {/* Locations Section */}
      <section className="world-section">
        <div className="section-header">
          <h3>Locations</h3>
          <button onClick={() => navigate(`/world/${worldId}/location/new`)}>+ Create Location</button>
        </div>
        {locations.length > 0 ? (
          <ul>
            {locations.map((l) => (
              <li key={l.id}>
                <span>{l.name}</span>
                <div className="actions">
                  <button onClick={() => navigate(`/world/${worldId}/location/${l.id}`)}>Edit</button>
                  <button
                    onClick={async () => {
                      await axios.delete(`${API_BASE_URL}/locations/${l.id}`, axiosConfig);
                      setLocations(locations.filter((loc) => loc.id !== l.id));
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No locations yet.</p>
        )}
      </section>
    </div>
  );
}
