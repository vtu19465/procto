import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QuestionsList = () => {
  const { assessmentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/assessments/${assessmentId}/questions`);
        const data = await response.json();

        if (data.success) {
          const formattedQuestions = data.questions.map((row) => ({
            ...row,
            options: row.options ? JSON.parse(row.options) : [],
          }));
          setQuestions(formattedQuestions);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [assessmentId]);

  const handleAddQuestion = () => {
    // Navigate to AddQuestions page, passing the assessmentId
    navigate(`/assessments/${assessmentId}/add-questions`);
  };

  const handleDeleteQuestion = async (questionId) => {
    const response = await fetch(`http://localhost:5000/questions/${questionId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    if (data.success) {
      // Update state to remove the deleted question
      setQuestions((prev) => prev.filter((q) => q.question_id !== questionId));
    } else {
      console.error(data.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Questions for Assessment ID: {assessmentId}</h2>
      <button className="btn btn-primary mb-3" onClick={handleAddQuestion}>
        Add Question
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Question ID</th>
            <th>Question Text</th>
            <th>Question Type</th>
            <th>Correct Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.question_id}>
              <td>{question.question_id}</td>
              <td>{question.question_text}</td>
              <td>{question.question_type}</td>
              <td>{question.correct_answer}</td>
              <td>
                <button className="btn btn-warning btn-sm">Edit</button>
                <button onClick={() => handleDeleteQuestion(question.question_id)} className="btn btn-danger btn-sm ms-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsList;
