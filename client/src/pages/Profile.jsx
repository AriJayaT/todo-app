// src/pages/Profile.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import profilePic from '../assets/pp.jpg'; 

const Profile = () => {
  const { user, updateProfile, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const { username, email, firstName, lastName, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords if provided
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Only include filled fields
    const updateData = {};
    if (username.trim() !== user.username) updateData.username = username;
    if (email.trim() !== user.email) updateData.email = email;
    if (firstName.trim() !== (user.firstName || '')) updateData.firstName = firstName;
    if (lastName.trim() !== (user.lastName || '')) updateData.lastName = lastName;
    if (password) updateData.password = password;

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      setError('No changes to update');
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile(updateData);
      setSuccess('Profile updated successfully');
      
      // Reset password fields
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
      
      // Close the update form after successful update
      setTimeout(() => {
        setShowUpdateForm(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary text-white">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card flex flex-col items-center">
          {/* Profile Image - Using the imported image */}
          <div className="h-32 w-32 rounded-full overflow-hidden mb-4">
            <img 
              src={profilePic} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* User name and email */}
          <h2 className="text-2xl font-bold mb-2">
            {user?.username || 'Spacebones'}
          </h2>
          <p className="text-lg mb-6">{user?.email || 'ari.teguh@binus.ac.id'}</p>
          
          {/* Account Details */}
          <div className="w-full p-4 bg-secondary-dark rounded mb-6">
            <h3 className="font-semibold mb-2">Account Details</h3>
            <p><span className="text-gray-400">Account Type:</span> Email & Password</p>
            <p><span className="text-gray-400">Member Since:</span> 5/6/2025</p>
          </div>
          
          {/* Bio */}
          <div className="text-center mb-6">
            <p>
              My name is Ari Jaya Teguh, and I am a Computer Science student at Binus International University. 
              I enjoy playing FPS games like Valorant and Counter-Strike, 
              as well as watching anime, korean drama, and movies. My favorite anime is Tensei 
              shitara Slime Datta Ken. I currently live in Alam Sutera.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link
              to="/todo-list"
              className="btn btn-primary"
            >
              My Todo List
            </Link>
            <button
              onClick={() => setShowUpdateForm(true)}
              className="btn btn-primary"
            >
              Update Profile
            </button>
            <Link
              to="/dashboard"
              className="btn btn-secondary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
      
      {/* Update Profile Popup */}
      {showUpdateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-secondary-dark rounded-lg shadow-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-primary">Update Profile</h3>
                <button 
                  onClick={() => setShowUpdateForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Alert messages */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              {authError && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
                  {authError}
                </div>
              )}
              
              {success && (
                <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded mb-4">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="username">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={lastName}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      className="input"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowUpdateForm(false)}
                    className="btn btn-secondary mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;