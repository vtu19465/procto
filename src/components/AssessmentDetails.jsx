import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InstructorNavbar from './InstructorNavbar';


const AssessmentDetails = () => {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/assessments/${assessmentId}`);
        const data = await response.json();
        if (data.success) {
          setAssessment(data.assessment);
        }
      } catch (error) {
        console.error('Error fetching assessment details:', error);
      }
    };

    fetchAssessmentDetails();
  }, [assessmentId]);

  const handleAddQuestions = () => {
    // Redirect to Add Questions page with assessment ID
    navigate(`/assessments/${assessmentId}/add-questions`);
  };

  if (!assessment) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <InstructorNavbar/>
    <div className="container mt-5">
      <h2 className="text-center mb-4">Assessment Details</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Title: {assessment.title}</h5>
          <p className="card-text">Description: {assessment.description}</p>
          <p className="card-text">Assessment ID: {assessment.assessment_id}</p>
          <button className="btn btn-primary" onClick={handleAddQuestions}>
            Add Questions
          </button>
        </div>
      </div>
    </div>
    </>
  );
};


export default AssessmentDetails;
