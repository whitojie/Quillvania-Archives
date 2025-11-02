import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function CharacterDetailPage() {
  const { worldId, charId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [character, setCharacter] = useState({ name: "", description: "", role: "" });

  const axiosConfig = { headers: { Authorization: `Bearer ${user?.access_token}` } };

  useEffect(() => {
    const fetchCharacter = async () => {
      const res = await axios.get(`${API_BASE_URL}/characters/${charId}`, axiosConfig);
      setCharacter(res.data);
    };
    fetchCharacter();
  }, [charId]);

  const handleSave = async (e) => {
    e.preventDefault();
    await axios.put(`${API_BASE_URL}/characters/${charId}`, character, axiosConfig);
    navigate(`/world/${worldId}`);
  };

  return (
    <div className="page-wrapper">
      <h2>Edit Character</h2>
      <form onSubmit={handleSave}>
        <input
          value={character.name}
          onChange={e => setCharacter({ ...character, name: e.target.value })}
          placeholder="Name"
        />
        <textarea
          value={character.description}
          onChange={e => setCharacter({ ...character, description: e.target.value })}
          placeholder="Description"
        />
        <input
          value={character.role}
          onChange={e => setCharacter({ ...character, role: e.target.value })}
          placeholder="Role"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
