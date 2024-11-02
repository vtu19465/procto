import React, { useEffect, useState } from 'react';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      const candidateId = localStorage.getItem('candidateId');
      if (!candidateId) {
        setError('No candidate session found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/results/${candidateId}`);
        const data = await response.json();

        if (data.success) {
          setResults(data.results);
        } else {
          setError('Failed to fetch results');
        }
      } catch (err) {
        setError('An error occurred while fetching results');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p>Loading results...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Results for Candidate</h2>
      {results.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Assessment ID</th>
              <th>Test Title</th> {/* New Column */}
              <th>Score</th>
              <th>Completed At</th>
              <th>Description</th> {/* New Column */}
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.result_id}>
                <td>{result.assessment_id}</td>
                <td>{result.test_title}</td> {/* Displaying Test Title */}
                <td>{result.score}</td>
                <td>{new Date(result.completed_at).toLocaleString()}</td>
                <td>{result.description}</td> {/* Displaying Description */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found for this candidate.</p>
      )}
    </div>
  );
};

export default ResultsPage;
