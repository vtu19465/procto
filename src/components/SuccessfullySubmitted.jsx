// SuccessfullySubmitted.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SuccessfullySubmitted = () => {
  return (
    <div className="container mt-5 text-center">
      <h2>Your results have been successfully submitted!</h2>
      <Link to="/dashboard" className="btn btn-primary mt-3">Go to Home</Link>
    </div>
  );
};

export default SuccessfullySubmitted;
