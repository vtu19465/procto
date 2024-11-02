
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function NavScrollExample() {
  return (
    <Container style={{ padding: '15px 35px' }}>
  <Navbar 
    expand="lg" 
    className="bg-body-tertiary" 
    style={{ borderRadius: '15px' }} // Set your desired border-radius
  >
    <Navbar.Brand href="#" className='mx-3'><h4>Assessment Platform</h4></Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarScroll" />
    <Navbar.Collapse id="navbarScroll">
      <Nav
        className="mx-auto my-4 my-lg-0"
        style={{ maxHeight: '100px' }}
        navbarScroll
      >
        <Link className="nav-link" to="/"><h5>Candidate</h5></Link>
        <Link className="nav-link" to="/InstructorLogin"><h5>Instructor</h5></Link>
        <Link className="nav-link" to="/AdminLogin"><h5>Admin</h5></Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
</Container>


  );
}

export default NavScrollExample;