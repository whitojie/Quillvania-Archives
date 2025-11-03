import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import WorldDetailPage from "./pages/WorldDetailPage";
import CharacterDetailPage from "./pages/CharacterDetailPage";
import EventDetailPage from "./pages/EventDetailPage";
import LocationDetailPage from "./pages/LocationDetailPage";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={user ? <DashboardPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/world/:worldId"
        element={user ? <WorldDetailPage /> : <Navigate to="/login" />}
      />

      {/* ✅ Character Routes */}
      {/* Create new character */}
      <Route
        path="/world/:worldId/character/new"
        element={user ? <CharacterDetailPage /> : <Navigate to="/login" />}
      />
      {/* Edit existing character */}
      <Route
        path="/world/:worldId/character/:charId"
        element={user ? <CharacterDetailPage /> : <Navigate to="/login" />}
      />

      {/* ✅ Event Routes */}
      <Route
        path="/world/:worldId/event/new"
        element={user ? <EventDetailPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/world/:worldId/event/:eventId"
        element={user ? <EventDetailPage /> : <Navigate to="/login" />}
      />

      {/* ✅ Location Routes */}
      <Route
        path="/world/:worldId/location/new"
        element={user ? <LocationDetailPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/world/:worldId/location/:locId"
        element={user ? <LocationDetailPage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
