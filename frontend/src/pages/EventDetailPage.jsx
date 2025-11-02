import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function EventDetailPage() {
  const { worldId, eventId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [event, setEvent] = useState({ name: "", description: "" });

  const axiosConfig = { headers: { Authorization: `Bearer ${user?.access_token}` } };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/events/${eventId}`, axiosConfig);
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/events/${eventId}`, event, axiosConfig);
      navigate(`/world/${worldId}`);
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  return (
    <div className="page-wrapper">
      <h2>Edit Event</h2>
      <form onSubmit={handleSave}>
        <input
          value={event.name}
          onChange={e => setEvent({ ...event, name: e.target.value })}
          placeholder="Event Name"
          required
        />
        <textarea
          value={event.description}
          onChange={e => setEvent({ ...event, description: e.target.value })}
          placeholder="Description"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
