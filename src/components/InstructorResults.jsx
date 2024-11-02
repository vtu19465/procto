import React, { useEffect, useState } from 'react';

const InstructorResults = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch assessments on component mount
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/assessments12');
        const data = await response.json();

        if (data.success) {
          setAssessments(data.assessments);
        } else {
          setError('Failed to fetch assessments');
        }
      } catch (err) {
        setError('An error occurred while fetching assessments');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  // Fetch results when an assessment is selected
  const fetchResults = async (assessmentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/results1/${assessmentId}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setError('Failed to fetch results for this assessment');
      }
    } catch (err) {
      setError('An error occurred while fetching results');
      console.error('Fetch error:', err);
    }
  };

  // Handle assessment selection
  const handleAssessmentChange = (e) => {
    const assessmentId = e.target.value;
    setSelectedAssessment(assessmentId);
    setResults([]); // Reset results
    if (assessmentId) {
      fetchResults(assessmentId);
    }
  };

  if (loading) return <p>Loading assessments...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Test Results for All Candidates</h2>
      
      <div className="mb-3">
        <label htmlFor="assessmentSelect" className="form-label">Select Assessment:</label>
        <select
          id="assessmentSelect"
          className="form-select"
          value={selectedAssessment}
          onChange={handleAssessmentChange}
        >
          <option value="">-- Choose an Assessment --</option>
          {assessments.map((assessment) => (
            <option key={assessment.assessment_id} value={assessment.assessment_id}>
              {assessment.title}
            </option>
          ))}
        </select>
      </div>

      {results.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Candidate ID</th>
              <th>Candidate Name</th>
              <th>Score</th>
              <th>Completed At</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.result_id}>
                <td>{result.candidate_id}</td>
                <td>{result.candidate_name}</td>
                <td>{result.score}</td>
                <td>{new Date(result.completed_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedAssessment && <p>No results found for this assessment.</p>
      )}
    </div>
  );
};

export default InstructorResults;
