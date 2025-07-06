import React from "react";
import { useNavigate } from "react-router-dom";

function AccountPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
        <p className="mb-2">You are logged in as:</p>
        <pre className="bg-gray-200 rounded p-2 mb-4 text-sm">
          {JSON.stringify(user, null, 2)}
        </pre>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default AccountPage;
