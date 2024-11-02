import React, { useEffect, useState } from 'react';

const InstructorProfile = () => {
  const [instructor, setInstructor] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const instructorId = 1; // Replace with the actual instructor ID or get from session

  useEffect(() => {
    const fetchInstructorProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/instructor/${instructorId}`);
        const data = await response.json();

        if (data.success) {
          setInstructor(data.instructor);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('An error occurred while fetching the instructor profile.');
        console.error(err);
      }
    };

    fetchInstructorProfile();
  }, [instructorId]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/instructor/${instructorId}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(data.message);
        setNewPassword(''); // Clear the password field
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/'; // Replace with your login page URL
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred while changing the password.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Instructor Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {instructor ? (
        <div>
          <p><strong>Name:</strong> {instructor.name}</p>
          <p><strong>Email:</strong> {instructor.email}</p>
          <p><strong>DOB:</strong> {instructor.dob}</p>
          <p><strong>Phone Number:</strong> {instructor.phone_number}</p>

          <h4 className="mt-4">Change Password</h4>
          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Change Password</button>
          </form>
        </div>
      ) : (
        <p>Loading instructor profile...</p>
      )}
    </div>
  );
};

export default InstructorProfile;
