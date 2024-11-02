import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const candidateId = localStorage.getItem('candidateId'); // Using sessionStorage, or switch to localStorage
      if (!candidateId) {
        setError('No candidate session found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/candidates/${candidateId}`);
        const data = await response.json();

        if (data.success) {
          setProfile(data.profile);
        } else {
          setError('Failed to fetch profile details.');
        }
      } catch (err) {
        setError('An error occurred while fetching profile details.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const candidateId = sessionStorage.getItem('candidateId'); // Ensure candidateId is available

    try {
      const response = await fetch(`http://localhost:5000/api/candidates/change-password/${candidateId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Password changed successfully. You will now be logged out.');
        // Log out user
        sessionStorage.removeItem('candidateId');
        navigate('/login');
      } else {
        setError('Failed to change password. Please check your old password.');
      }
    } catch (err) {
      setError('An error occurred while updating the password.');
      console.error('Error updating password:', err);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Candidate Profile</h2>
      {profile ? (
        <div className="card p-4">
          <h5>Name: {profile.name}</h5>
          <p>Email: {profile.email}</p>
          <p>Date of Birth: {profile.dob}</p>
          <p>College ID: {profile.college_id}</p>
          <p>Phone Number: {profile.phone_no}</p>
          <p>Joined on: {new Date(profile.created_at).toLocaleDateString()}</p>

          {!isPasswordChange ? (
            <button className="btn btn-warning mt-3" onClick={() => setIsPasswordChange(true)}>
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="mt-3">
              <div className="mb-3">
                <label htmlFor="oldPassword" className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Submit New Password</button>
              <button className="btn btn-secondary ms-3" onClick={() => setIsPasswordChange(false)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      ) : (
        <p>No profile details found.</p>
      )}
    </div>
  );
};

export default ProfilePage;
