import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, where, getDocs } from "firebase/firestore";
import profilePic from "../assets/pp.jpg";

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length > 0) {
          setUserData(docs.docs[0].data());
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    
    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-800 to-black min-h-screen flex justify-center items-center">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-800 to-black min-h-screen flex flex-col items-center p-4 text-white">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Profile</h1>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 cursor-pointer"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-purple-900 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex flex-col items-center">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4"
              />
            ) : (
              <img
                src={profilePic}
                alt="Default Profile"
                className="w-32 h-32 rounded-full mb-4"
              />
            )}
            
            <h2 className="text-2xl font-bold mb-2">
              {userData?.name || user?.displayName || "User"}
            </h2>
            
            <p className="text-lg mb-4">{user?.email}</p>
            
            <div className="w-full p-4 bg-purple-800 rounded mb-4">
              <h3 className="font-semibold mb-2">Account Details</h3>
              <p><span className="opacity-70">Account Type:</span> {userData?.authProvider === "google" ? "Google Login" : "Email & Password"}</p>
              <p><span className="opacity-70">Member Since:</span> {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Unknown"}</p>
            </div>
            
            <div className="text-center mt-2">
              <p>
                My name is {userData?.name || user?.displayName || "User"}, and I am a Computer Science student at Binus International University. 
                I enjoy playing FPS games like Valorant and Counter-Strike, 
                as well as watching anime, korean drama, and movies. My favorite anime is Tensei shitara Slime Datta Ken. 
                I currently live in Alam Sutera.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            to="/todo"
            className="px-4 py-2 bg-purple-700 rounded hover:bg-purple-600 text-lg"
          >
            My To-Do List
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-lg"
          >
            Back to Landing
          </Link>
        </div>
      </div>
    </div>
  );
}
