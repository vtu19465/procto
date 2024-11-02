import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TestPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [candidateId, setCandidateId] = useState(null); // State for candidate ID

  useEffect(() => {
    // Fetch candidate ID from localStorage
    const storedCandidateId = localStorage.getItem('candidateId'); // Fetch from localStorage
    if (storedCandidateId) {
      setCandidateId(storedCandidateId); // Store in state
    } else {
      alert("No candidate session found. Please log in.");
      navigate('/login'); // Navigate to login if no candidate ID is found
    }
  }, [navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/assessments/${assessmentId}/questions1`);
        const data = await response.json();

        if (data.success) {
          setQuestions(data.questions);
        } else {
          setError('Failed to fetch questions');
          console.error('Error fetching questions:', data.message);
        }
      } catch (err) {
        setError('An error occurred while fetching questions');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [assessmentId]);

  const handleNext = () => {
    if (selectedOption) {
      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questions[currentQuestionIndex].question_id]: selectedOption,
      }));

      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
    } else {
      alert("Please select an option before proceeding to the next question.");
    }
  };

  const handleSubmit = async () => {
    if (selectedOption) {
      setUserAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questions[currentQuestionIndex].question_id]: selectedOption,
      }));
    }

    if (Object.keys(userAnswers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    let score = 0;

    questions.forEach((question) => {
      const userAnswer = userAnswers[question.question_id];
      if (userAnswer && userAnswer.trim() === question.correct_answer.trim()) {
        score += 1;
      }
    });

    const resultData = {
      candidate_id: candidateId, // Use the candidate ID from local storage
      assessment_id: assessmentId,
      score: score,
      completed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    try {
      const response = await fetch('http://localhost:5000/api/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });

      if (response.ok) {
        // Navigate to SuccessfullySubmitted page
        navigate('/successfully-submitted');
      } else {
        alert('Failed to submit results. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting results:', error);
      alert('An error occurred while submitting results. Please try again.');
    }
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Test for Assessment ID: {assessmentId}</h2>
      {currentQuestion ? (
        <div>
          <h5>{currentQuestion.question_text}</h5>
          {Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
            currentQuestion.options.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  name="options"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                />
                <label className="form-check-label">{option}</label>
              </div>
            ))
          ) : (
            <p>No options available for this question.</p>
          )}
          <div className="mt-3">
            {currentQuestionIndex < questions.length - 1 ? (
              <button className="btn btn-primary" onClick={handleNext} disabled={!selectedOption}>
                Next
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleSubmit} disabled={!selectedOption}>
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default TestPage;
