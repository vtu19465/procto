import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import InstructorNavbar from './InstructorNavbar';

const AddQuestions = () => {
  const { assessmentId } = useParams(); // Get assessmentId from URL parameters
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAddQuestion = async () => {
    const newQuestionData = {
      question_text: newQuestion,
      question_type: questionType,
      options: options.filter(option => option !== ''),
      correct_answer: correctAnswer,
    };

    try {
      const response = await fetch(`http://localhost:5000/assessments/${assessmentId}/add-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestionData),
      });

      const data = await response.json();
      if (data.success) {
        setQuestions([...questions, { ...newQuestionData, question_id: data.question_id }]);
        setNewQuestion('');
        setOptions(['', '', '', '']);
        setCorrectAnswer('');
        setSuccess('Question added successfully!');
      } else {
        setError('Failed to add question');
      }
    } catch (error) {
      setError('An error occurred while adding the question');
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  return (
    <>
      <InstructorNavbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Add Questions to Assessment</h2>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="question" className="form-label">Question</label>
          <input
            type="text"
            className="form-control"
            id="question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter your question"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="questionType" className="form-label">Question Type</label>
          <select
            className="form-control"
            id="questionType"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="MCQ">Multiple Choice (MCQ)</option>
            <option value="Descriptive">Descriptive</option>
            <option value="Coding">Coding</option>
          </select>
        </div>

        {questionType === 'MCQ' && (
          <div>
            {options.map((option, index) => (
              <div className="mb-3" key={index}>
                <label htmlFor={`option-${index}`} className="form-label">{`Option ${index + 1}`}</label>
                <input
                  type="text"
                  className="form-control"
                  id={`option-${index}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Enter option ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="correctAnswer" className="form-label">Correct Answer</label>
          <input
            type="text"
            className="form-control"
            id="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Enter the correct answer"
          />
        </div>

        <button className="btn btn-primary" onClick={handleAddQuestion}>Add Question</button>

        <hr />

        <h3>Existing Questions</h3>
        <ul className="list-group">
          {questions.map((q) => (
            <li className="list-group-item" key={q.question_id}>
              <h5>{q.question_text}</h5>
              <p>Type: {q.question_type}</p>
              {q.question_type === 'MCQ' && (
                <ul>
                  {q.options.map((opt, idx) => (
                    <li key={idx}>{opt}</li>
                  ))}
                </ul>
              )}
              <p>Correct Answer: {q.correct_answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AddQuestions;
