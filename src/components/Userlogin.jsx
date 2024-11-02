import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Store candidateId in localStorage
        console.log('Candidate ID:', data.candidateId); // Log the candidateId to confirm
        localStorage.setItem('candidateId', data.candidateId);
  
        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };
  
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card p-5 rounded shadow-lg" style={{ width: '500px' }}>
        <h2 className="text-center mb-4" style={{ color: '#007bff' }}>Welcome Candidate</h2>
        <h5 className="text-center" style={{ paddingBottom: '15px' }}>Enter your Email and Password to Sign In</h5>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <div className="form-check form-switch mb-3">
            <input className="form-check-input" type="checkbox" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>

        <div className="text-center mt-3">
          <Link to="/registration" className="text-muted">For Registration - Click Here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
