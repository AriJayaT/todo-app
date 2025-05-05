import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Todo from "./pages/Todo";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  
  if (loading) {
    return <div className="bg-gradient-to-r from-purple-800 to-black min-h-screen flex justify-center items-center">
      <p className="text-white text-xl">Loading...</p>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default function App() {
  const [user, loading] = useAuthState(auth);

  // Redirect logic for the root path
  const handleRootRedirect = () => {
    if (loading) {
      return (
        <div className="bg-gradient-to-r from-purple-800 to-black min-h-screen flex justify-center items-center">
          <p className="text-white text-xl">Loading...</p>
        </div>
      );
    }
    
    return user ? <Landing /> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={handleRootRedirect()} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<Reset />} />
        <Route 
          path="/todo" 
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        {/* Add a catch-all route to redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
