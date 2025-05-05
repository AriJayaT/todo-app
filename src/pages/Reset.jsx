import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/todo");
  }, [user, loading, navigate]);

  return (
    <div className="bg-gradient-to-r from-purple-800 to-black min-h-screen flex flex-col justify-center items-center text-white p-4">
      <div className="bg-purple-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>
        
        <div className="mb-6">
          <label className="block mb-2 text-lg">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-200 text-black text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Email Address"
          />
        </div>
        
        <button
          onClick={() => sendPasswordReset(email)}
          className="w-full mb-6 p-3 bg-purple-700 rounded hover:bg-purple-600 text-xl font-semibold cursor-pointer"
        >
          Send Reset Email
        </button>
        
        <div className="flex justify-center">
          <Link to="/login" className="text-purple-300 hover:text-white">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}