import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstuctorNavbar from './InstructorNavbar';

const AssessmentsList = () => {
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      const response = await fetch('http://localhost:5000/assessments');
      const data = await response.json();
      if (data.success) {
        setAssessments(data.assessments);
      }
    };
    fetchAssessments();
  }, []);

  const handleDeleteAssessment = async (assessmentId) => {
    const response = await fetch(`http://localhost:5000/assessments/${assessmentId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    if (data.success) {
      setAssessments((prev) => prev.filter((assessment) => assessment.assessment_id !== assessmentId));
    } else {
      console.error(data.message);
    }
  };

  return (
    <>
      <InstuctorNavbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Assessments List</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Assessment ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment) => (
              <tr key={assessment.assessment_id}>
                <td>{assessment.assessment_id}</td>
                <td>{assessment.title}</td>
                <td>{assessment.description}</td>
                <td>{assessment.created_by}</td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => navigate(`/questions/${assessment.assessment_id}`)}
                  >
                    View Questions
                  </button>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleDeleteAssessment(assessment.assessment_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AssessmentsList;
