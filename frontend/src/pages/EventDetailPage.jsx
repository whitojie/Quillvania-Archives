import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function EventDetailPage() {
  const { worldId, eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [event, setEvent] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(true);

  const axiosConfig = { 
    headers: { 
      
      Authorization: `Bearer ${user?.access_token}`
       
    } 
  };

  // Debug: Log everything about the route
  useEffect(() => {
    console.log("🔍 Route Analysis:", {
      worldId,
      eventId,
      pathname: location.pathname,
      fullUrl: window.location.href,
      params: { worldId, eventId }
    });
    
    // Extract eventId from URL manually as fallback
    const pathParts = location.pathname.split('/');
    console.log("📁 Path parts:", pathParts);
    
    const manualWorldId = pathParts[2]; // /world/:worldId/event/:eventId
    const manualEventId = pathParts[4];
    console.log("🛠️ Manually extracted:", { manualWorldId, manualEventId });
  }, [location, worldId, eventId]);

  useEffect(() => {
    // If eventId is undefined, try to extract it from the URL
    let actualEventId = eventId;
    if (!eventId && location.pathname.includes('/event/')) {
      const pathParts = location.pathname.split('/');
      actualEventId = pathParts[4]; // /world/11/event/123
      console.log("🔄 Extracted eventId from URL:", actualEventId);
    }

    if (!actualEventId || actualEventId === "new") {
      console.log("✅ Creating new event");
      setIsCreating(true);
    } else {
      console.log("📝 Editing existing event, ID:", actualEventId);
      setIsCreating(false);
      
      // Fetch existing event data
      const fetchEvent = async () => {
        try {
          setLoading(true);
          console.log(`📡 Fetching event: ${API_BASE_URL}/events/${actualEventId}`);
          const res = await axios.get(`${API_BASE_URL}/events/${actualEventId}`, axiosConfig);
          setEvent(res.data);
        } catch (err) {
          console.error("❌ Error fetching event:", err);
          alert("Failed to load event");
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [eventId, location.pathname]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!event.title.trim()) {  // Changed from event.name to event.title
      alert("Event title is required");  // Updated error message
      return;
    }

    try {
      setLoading(true);
      
      if (isCreating) {
        await axios.post(
          `${API_BASE_URL}/events/world/${worldId}`,
          {
            title: event.title.trim(),
            description: event.description?.trim() || null,
            date: event.date || null,          // optional
            location_id: event.location_id || null  // optional
          },
          axiosConfig
        );
      } else {
        // For editing, use the eventId from URL or params
        const actualEventId = eventId || location.pathname.split('/')[4];
        if (!actualEventId) {
          alert("Cannot determine event ID for update");
          return;
        }
        
        // Send clean data for update as well
        const eventData = {
          title: event.title.trim(),  // Changed from name to title
          description: event.description?.trim() || null
        };
        
        await axios.put(
          `${API_BASE_URL}/events/${actualEventId}`, 
          eventData, 
          axiosConfig
        );
      }
      
      navigate(`/world/${worldId}`);
    } catch (err) {
      console.error("❌ Error saving event:", err);
      console.error("Error response:", err.response?.data);
      
      // Better error display
      if (err.response?.data?.detail) {
        alert(`Error: ${JSON.stringify(err.response.data.detail)}`);
      } else {
        alert("Failed to save event");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/world/${worldId}`);
  };

  if (loading && !isCreating) {
    return <div className="page-wrapper">Loading event data...</div>;
  }

  return (
    <div className="page-wrapper">
      <h2>{isCreating ? "Create New Event" : "Edit Event"}</h2>
      <div style={{ background: '#f5f5f5', padding: '10px', marginBottom: '20px', borderRadius: '4px' }}>
        <strong>Debug Info:</strong> 
        <div>Mode: {isCreating ? "Creating New" : "Editing"}</div>
        <div>World ID: {worldId}</div>
        <div>Event ID: {eventId || "undefined"}</div>
        <div>Current Path: {location.pathname}</div>
      </div>
      
      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="eventTitle">Event Title</label>  {/* Changed from Event Name */}
          <input
            id="eventTitle"  // Changed ID
            value={event.title}  // Changed from event.name to event.title
            onChange={e => setEvent({ ...event, title: e.target.value })}  // Changed name to title
            placeholder="Enter event title"  // Updated placeholder
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="eventDescription">Description</label>
          <textarea
            id="eventDescription"
            value={event.description}
            onChange={e => setEvent({ ...event, description: e.target.value })}
            placeholder="Enter event description"
            rows="4"
            disabled={loading}
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : (isCreating ? "Create Event" : "Save Changes")}
          </button>
        </div>
      </form>
    </div>
  );
}