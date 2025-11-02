import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function WorldDetailPage() {
  const { worldId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [world, setWorld] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);

  const axiosConfig = { headers: { Authorization: `Bearer ${user?.access_token}` } };

  useEffect(() => {
    const fetchWorldData = async () => {
      try {
        const [worldRes, charRes, eventRes, locRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/worlds/${worldId}`, axiosConfig),
          axios.get(`${API_BASE_URL}/characters/world/${worldId}`, axiosConfig),
          axios.get(`${API_BASE_URL}/events/world/${worldId}`, axiosConfig),
          axios.get(`${API_BASE_URL}/locations/world/${worldId}`, axiosConfig),
        ]);
        setWorld(worldRes.data);
        setCharacters(charRes.data);
        setEvents(eventRes.data);
        setLocations(locRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWorldData();
  }, [worldId]);

  if (!world) return <p>Loading...</p>;

  return (
    <div className="page-wrapper">
      <Link to="/dashboard">&larr; Back to Dashboard</Link>
      <h2>{world.name}</h2>
      <p>{world.description}</p>

      <h3>Characters</h3>
      {characters.map(c => (
        <Link key={c.id} to={`/world/${worldId}/character/${c.id}`}>{c.name}</Link>
      ))}

      <h3>Events</h3>
      {events.map(e => (
        <Link key={e.id} to={`/world/${worldId}/event/${e.id}`}>{e.name}</Link>
      ))}

      <h3>Locations</h3>
      {locations.map(l => (
        <Link key={l.id} to={`/world/${worldId}/location/${l.id}`}>{l.name}</Link>
      ))}
    </div>
  );
}
