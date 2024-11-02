import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAssessment = ({ instructorId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAssessment = {
      title,
      description,
      created_by: instructorId,
    };

    try {
      const response = await fetch('http://localhost:5000/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAssessment),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Assessment added successfully!');
        setTitle('');
        setDescription('');
        // Redirect to AssessmentDetails with the new assessment ID
        navigate(`/assessments/${data.assessment_id}`);
      } else {
        setError('Failed to add assessment.');
      }
    } catch (error) {
      setError('An error occurred while adding the assessment.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Assessment</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Assessment Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter assessment title"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Assessment Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter assessment description"
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Add Assessment</button>
      </form>
    </div>
  );
};

export default AddAssessment;
