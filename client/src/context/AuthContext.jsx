// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get the Firebase ID token
          const idToken = await firebaseUser.getIdToken();
          
          // Verify the token with our backend
          const res = await axios.post('/api/auth/firebase', { idToken }, {
            withCredentials: true
          });
          
          setUser(res.data.user);
        } catch (err) {
          console.error('Error verifying Firebase token:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      // Create user in Firebase
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Get the Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Register user in our backend
      const res = await axios.post('/api/auth/register', {
        ...userData,
        firebaseUid: firebaseUser.uid
      }, {
        withCredentials: true
      });

      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setError(null);
      // Sign in with Firebase
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Get the Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Login with our backend
      const res = await axios.post('/api/auth/firebase', { idToken }, {
        withCredentials: true
      });

      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      // Sign in with Google
      const { user: firebaseUser } = await signInWithPopup(auth, googleProvider);

      // Get the Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Login with our backend
      const res = await axios.post('/api/auth/firebase', { idToken }, {
        withCredentials: true
      });

      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.message || 'Google login failed');
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Logout from our backend
      await axios.get('/api/auth/logout', {
        withCredentials: true
      });
      
      setUser(null);
    } catch (err) {
      setError(err.message || 'Logout failed');
      throw err;
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const res = await axios.put('/api/users/profile', userData, {
        withCredentials: true
      });
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;