import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_URL;


export default function AppBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("isLoggedIn") || !!localStorage.getItem("token")
  );

  useEffect(() => {
    // Listen for login/logout across tabs or components
    const handleStorageChange = () => {
      setIsLoggedIn(
        !!localStorage.getItem("isLoggedIn") || !!localStorage.getItem("token")
      );
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
     await axios.post(`${API_BASE_URL}/api/v1/user/signout`, {}, { withCredentials: true });
     
      // ✅ Remove local state
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");

      // ✅ Update UI immediately
      setIsLoggedIn(false);

      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      {/* Logo */}
      <button
        onClick={() => navigate("/blogs")}
        className="text-2xl font-bold text-gray-900 hover:text-black transition"
      >
        Medium<span className="text-green-600">Lite</span>
      </button>

      {/* Search Bar */}
      <div className="hidden sm:flex items-center bg-gray-100 px-3 py-2 rounded-full w-1/3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-500 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.817-4.817A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none text-sm flex-1"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/write")}
          className="text-sm font-medium px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
        >
          Write
        </button>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm font-medium px-4 py-2 text-white bg-black rounded-full hover:bg-gray-800 transition"
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="text-sm font-medium px-4 py-2 text-white bg-black rounded-full hover:bg-gray-800 transition"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
