import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function CandidateNavbar() {
  const [candidateId, setCandidateId] = useState(null);

  // Fetch candidateId from localStorage or sessionStorage
  useEffect(() => {
    const storedCandidateId = localStorage.getItem('candidateId'); // or sessionStorage.getItem('candidateId');
    if (storedCandidateId) {
      setCandidateId(storedCandidateId);
      console.log('Candidate ID:', storedCandidateId); // Log the candidateId to console
    }
  }, []);

  return (
    <Container style={{ padding: '15px 35px' }}>
      <Navbar 
        expand="lg" 
        className="bg-body-tertiary" 
        style={{ borderRadius: '15px' }} // Set your desired border-radius
      >
        <Navbar.Brand href="#" className="mx-3"><h4>Assessment - Candidate</h4></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="mx-auto my-4 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Link className="nav-link" to="/dashboard"><h5>Assessments</h5></Link>
            {candidateId && (
              <Link className="nav-link" to={`/api/results/${candidateId}`}><h5>Results</h5></Link>
            )}
            <Link className="nav-link" to={`/api/candidates/${candidateId}`}><h5>Profile</h5></Link>
            <Link className="nav-link" to="/logout"><h5>Logout</h5></Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}

export default CandidateNavbar;
