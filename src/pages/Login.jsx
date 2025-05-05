import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/"); // Navigate to landing page after login
  }, [user, loading, navigate]);

  return (
    <div className="bg-gradient-to-r from-purple-800 to-black min-h-screen flex flex-col justify-center items-center text-white p-4">
      <div className="bg-purple-900 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome to SpaceApp
        </h1>
        
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
        
        <div className="mb-6">
          <label className="block mb-2 text-lg">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-200 text-black text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Password"
          />
        </div>
        
        <button
          onClick={() => logInWithEmailAndPassword(email, password)}
          className="w-full mb-4 p-3 bg-purple-700 rounded hover:bg-purple-600 text-xl font-semibold cursor-pointer"
        >
          Login
        </button>
        
        <button
          onClick={signInWithGoogle}
          className="w-full mb-6 p-3 bg-white text-black rounded hover:bg-gray-200 text-xl font-semibold flex justify-center items-center cursor-pointer"
        >
          <span className="mr-2">Sign in with Google</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
        </button>
        
        <div className="flex justify-between text-sm">
          <Link to="/reset" className="text-purple-300 hover:text-white">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-purple-300 hover:text-white">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}