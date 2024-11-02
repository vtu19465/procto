import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';


function candidateNavbar() {
  return (
    <Container style={{ padding: '15px 35px' }}>
  <Navbar 
    expand="lg" 
    className="bg-body-tertiary" 
    style={{ borderRadius: '15px' }} // Set your desired border-radius
  >
    <Navbar.Brand className='mx-3'><Link to="/InstructorDashboard"><h4 style={{ color: 'black' }}>Assessment - Instructor</h4> </Link></Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarScroll" />
    <Navbar.Collapse id="navbarScroll">
      <Nav
        className="mx-auto my-4 my-lg-0"
        style={{ maxHeight: '100px' }}
        navbarScroll
      >
        <Link className="nav-link" to="/InstructorDashboard"><h5>Add Assessments</h5></Link>
        <Link className="nav-link" to="/AssessmentsList"><h5>Assessments Details</h5></Link>
        <Link className="nav-link" to="/InstructorResults"><h5>Results</h5></Link>
        <Link className="nav-link" to="/InstructorProfile"><h5>Profile</h5></Link>
        <Link className="nav-link" to="/Logout"><h5>Logout</h5></Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
</Container>


  );
}

export default candidateNavbar;