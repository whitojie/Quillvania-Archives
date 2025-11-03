import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function LocationDetailPage() {
  const { worldId, locId } = useParams();
  const navigate = useNavigate();
  const locationObj = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [locationData, setLocationData] = useState({ name: "", description: "", coordinates: "" });
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(true);

  const axiosConfig = { headers: { Authorization: `Bearer ${user?.access_token}` } };

  useEffect(() => {
    // Determine if creating or editing
    if (!locId || locId === "new") {
      setIsCreating(true);
    } else {
      setIsCreating(false);
      const fetchLocation = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${API_BASE_URL}/locations/${locId}`, axiosConfig);
          setLocationData(res.data);
        } catch (err) {
          console.error("Error fetching location:", err);
          alert("Failed to load location");
        } finally {
          setLoading(false);
        }
      };
      fetchLocation();
    }
  }, [locId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!locationData.name.trim()) {
      alert("Location name is required");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: locationData.name.trim(),
        description: locationData.description?.trim() || null,
        coordinates: locationData.coordinates?.trim() || null,
        world_id: worldId
      };

      if (isCreating) {
        await axios.post(`${API_BASE_URL}/locations`, payload, axiosConfig);
      } else {
        await axios.put(`${API_BASE_URL}/locations/${locId}`, payload, axiosConfig);
      }

      navigate(`/world/${worldId}`);
    } catch (err) {
      console.error("Error saving location:", err);
      alert("Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(`/world/${worldId}`);

  return (
    <div className="page-wrapper">
      <h2>{isCreating ? "Create Location" : "Edit Location"}</h2>

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Name</label>
          <input
            value={locationData.name}
            onChange={e => setLocationData({ ...locationData, name: e.target.value })}
            placeholder="Location Name"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={locationData.description}
            onChange={e => setLocationData({ ...locationData, description: e.target.value })}
            placeholder="Description"
            rows="4"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Coordinates (optional)</label>
          <input
            value={locationData.coordinates}
            onChange={e => setLocationData({ ...locationData, coordinates: e.target.value })}
            placeholder="Coordinates"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : isCreating ? "Create Location" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
