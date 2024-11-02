
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// Enable CORS and use body-parser middleware
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection pool
const db = mysql.createPool({
  host: 'YUKI-11',
  user: 'root@localhost',
  password: 'Pass.12',
  database: 'assessment_platform',
});

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Assessment Platform API!');
});

// Candidate Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Received login request:', { email, password });

  const query = 'SELECT * FROM candidates WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.json({ success: false, message: 'An error occurred' });
    }

    if (results.length > 0) {
      const candidate = results[0];
      if (password === candidate.password) {
        res.json({ success: true, message: 'Login successful!', candidateId: candidate.candidate_id });
      } else {
        res.json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// Get Candidate Profile
app.get('/api/candidates/:candidateId', (req, res) => {
  const candidateId = req.params.candidateId;

  const query = 'SELECT candidate_id, username, email, name, dob, college_id, phone_no, created_at FROM candidates WHERE candidate_id = ?';
  db.query(query, [candidateId], (err, results) => {
    if (err) {
      console.error('Error fetching candidate profile:', err);
      return res.status(500).json({ success: false, message: 'Database query error' });
    }

    if (results.length > 0) {
      res.json({ success: true, profile: results[0] });
    } else {
      res.status(404).json({ success: false, message: 'Candidate not found' });
    }
  });
});

// Change Candidate Password
app.post('/api/candidates/change-password/:candidateId', (req, res) => {
  const candidateId = req.params.candidateId;
  const { oldPassword, newPassword } = req.body;

  const query = 'SELECT password FROM candidates WHERE candidate_id = ?';
  db.query(query, [candidateId], (err, results) => {
    if (err) {
      console.error('Error checking current password:', err);
      return res.status(500).json({ success: false, message: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const currentPassword = results[0].password;
    if (oldPassword !== currentPassword) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    const updateQuery = 'UPDATE candidates SET password = ? WHERE candidate_id = ?';
    db.query(updateQuery, [newPassword, candidateId], (err) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ success: false, message: 'Failed to update password' });
      }
      res.json({ success: true, message: 'Password changed successfully' });
    });
  });
});

// Admin Login
app.post('/admin-login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM admin WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.json({ success: false, message: 'An error occurred' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful', role: 'admin', redirectUrl: '/admin-dashboard' });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// Instructor Login
app.post('/instructor-login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM instructor WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.json({ success: false, message: 'An error occurred' });
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful', role: 'instructor', redirectUrl: '/instructor-dashboard' });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// Add a New Assessment
app.post('/assessments', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required' });
  }

  const created_by = req.userId || 1; // Replace with the instructor's ID if applicable
  const query = 'INSERT INTO assessments (title, description, created_by, created_at) VALUES (?, ?, ?, NOW())';
  
  db.query(query, [title, description, created_by], (err, results) => {
    if (err) {
      console.error('Database insertion error:', err);
      return res.status(500).json({ success: false, message: 'An error occurred while adding the assessment' });
    }
    res.json({ success: true, message: 'Assessment added successfully!', assessment_id: results.insertId });
  });
});

// Get All Assessments with Questions
app.get('/assessments', (req, res) => {
  const query = `
    SELECT a.assessment_id, a.title, a.description, a.created_at, q.question_id, q.question_text
    FROM assessments a
    LEFT JOIN questions q ON a.assessment_id = q.assessment_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching assessments' });
    }

    const assessments = results.reduce((acc, row) => {
      const { assessment_id, title, description, created_at, question_id, question_text } = row;
      if (!acc[assessment_id]) {
        acc[assessment_id] = {
          assessment_id,
          title,
          description,
          created_at, 
          questions: [],
        };
      }
      if (question_id) {
        acc[assessment_id].questions.push({ question_id, question_text });
      }
      return acc;
    }, {});

    res.json({ success: true, assessments: Object.values(assessments) });
  });
});

// Add a New Question to an Assessment
app.post('/assessments/:assessmentId/add-questions', (req, res) => {
  const { assessmentId } = req.params;
  if (isNaN(assessmentId)) {
    return res.status(400).json({ error: 'Invalid assessment ID' });
  }

  const { question_text, question_type, options, correct_answer } = req.body;
  const optionsJSON = question_type === 'MCQ' ? JSON.stringify(options) : null;

  const query = `
    INSERT INTO questions (assessment_id, question_text, question_type, options, correct_answer)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [assessmentId, question_text, question_type, optionsJSON, correct_answer], (err, result) => {
    if (err) {
      console.error('Error adding question:', err);
      return res.status(500).json({ success: false, message: 'An error occurred while adding the question' });
    }
    res.json({ success: true, question_id: result.insertId });
  });
});

// Get All Questions for an Assessment
app.get('/assessments/:assessmentId/questions', (req, res) => {
  const { assessmentId } = req.params;
  const query = `
    SELECT question_id, question_text, question_type, options, correct_answer
    FROM questions
    WHERE assessment_id = ?
  `;

  db.query(query, [assessmentId], (err, results) => {
    if (err) {
      console.error('Error fetching questions:', err);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching questions' });
    }

    res.json({ success: true, questions: results });
  });
});

// Delete a Question
app.delete('/questions/:questionId', (req, res) => {
  const { questionId } = req.params;
  const query = 'DELETE FROM questions WHERE question_id = ?';

  db.query(query, [questionId], (err) => {
    if (err) {
      console.error('Error deleting question:', err);
      return res.status(500).json({ success: false, message: 'An error occurred while deleting the question' });
    }

    res.json({ success: true, message: 'Question deleted successfully' });
  });
});

// Get Results for a Candidate
app.get('/api/results/:candidateId', (req, res) => {
  const candidateId = req.params.candidateId;

  const query = 'SELECT * FROM results WHERE candidate_id = ?'; // Adjust based on your database schema
  db.query(query, [candidateId], (err, results) => {
    if (err) {
      console.error('Error fetching results:', err);
      return res.status(500).json({ success: false, message: 'Database query error' });
    }

    if (results.length > 0) {
      res.json({ success: true, results });
    } else {
      res.status(404).json({ success: false, message: 'No results found for this candidate' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
