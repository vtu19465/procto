import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AssessmentsList = () => {
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the assessments from the server
    const fetchAssessments = async () => {
      try {
        const response = await fetch('http://localhost:5000/assessments');
        const data = await response.json();

        if (data.success) {
          setAssessments(data.assessments);
        } else {
          setError('Failed to fetch assessments');
        }
      } catch (err) {
        setError('An error occurred while fetching assessments');
      }
    };

    fetchAssessments();
  }, []);

  const handleTakeTest = async (assessmentId) => {
    // Perform system checks here (dummy check for demonstration)
    const systemCheckPassed = await performSystemChecks();
    if (systemCheckPassed) {
      navigate(`/assessments/${assessmentId}/test`);
    } else {
      alert('System check failed. Please ensure your system meets the requirements.');
    }
  };

  const performSystemChecks = async () => {
    // Implement your actual system check logic here
    // Return true if checks pass, false otherwise
    return true; // For demo purposes, assume the check always passes
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Available Assessments</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {assessments.map((assessment) => (
          <div key={assessment.assessment_id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{assessment.title}</h5>
                <p className="card-text">{assessment.description}</p>
                <small className="text-muted">Created at: {new Date(assessment.created_at).toLocaleString()}</small>
                <div className="text-center mt-3">
                <button className="btn btn-primary" onClick={() => handleTakeTest(assessment.assessment_id)}>Take Test</button>
               </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentsList;
