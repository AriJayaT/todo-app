import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Landing() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-gradient-to-r from-purple-800 to-black min-h-screen flex flex-col items-center text-white">
      {/* Header with user info and logout */}
      <div className="w-full p-4 bg-purple-900 flex justify-between items-center">
        <h2 className="text-xl font-bold">My App</h2>
        <div className="flex items-center">
          {user?.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <span className="mr-4">{user?.displayName || user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col justify-center items-center p-4">
        <h1 className="text-4xl font-bold mb-6">Welcome to My App</h1>
        <p className="text-center max-w-md mb-8">
          You're now logged in! You can access your to-do list or view your profile.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/todo"
            className="px-6 py-3 bg-purple-700 rounded hover:bg-purple-600 text-xl text-center"
          >
            Go to To-Do List
          </Link>
          <Link
            to="/profile"
            className="px-6 py-3 bg-gray-700 rounded hover:bg-gray-600 text-xl text-center"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}