import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import CandidateLogin from './pages/Candidate/LoginandRegistration';
import CandidateDashboard from './pages/Candidate/Candidatedashboard'; 
import InstructorNavbar from './components/InstructorNavbar';
import AdminLogin from './pages/Admin/Adminlogin';
import InstructorLogin from './pages/Instructor/InstructorLogin';
import InstructorDashboard from './pages/Instructor/InstructorDashboard';
import AddAssessment from './components/InstructorAddAssessments';
import AssessmentDetails from './components/AssessmentDetails';
import AssessmentsList from './components/Assessmentslist';
import AddQuestions from './components/AddQuestions';
import QuestionsList from './components/QuestionsList';
import TestPage from './components/TestPage';
import Logout from './components/Logout';
import SuccessfullySubmitted from './components/SuccessfullySubmitted';
import ResultsPage from './components/ResultsPage'; 
import CandidateNavbar from './components/candidateNavbar';
import CandidateProfile from './components/Candidateprofile';
import InstructorResults from './components/InstructorResults';
import InstructorProfile from './components/InstructorProfile';
import RegistrationForm from './components/RegistrationForm'; // Updated import path

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandidateLogin />} />
        <Route path="/dashboard" element={<CandidateDashboard />} />
        <Route path="/InstructorLogin" element={<InstructorLogin />} />
        <Route path="/InstructorDashboard" element={<InstructorDashboard />} />
        <Route path="/AssessmentsList" element={<AssessmentsList />} />
        <Route path="/add-assessment" element={<AddAssessment instructorId={1} />} />
        <Route path="/assessments/:assessmentId" element={<AssessmentDetails />} />
        <Route path="/api/results/:candidateId" element={<><CandidateNavbar /><ResultsPage /></>} />
        <Route path="/api/candidates/:candidateId" element={<><CandidateNavbar /><CandidateProfile /></>} />
        <Route path="/assessments/:assessmentId/add-questions" element={<AddQuestionsWrapper />} />
        <Route path="/assessments/:assessmentId/test" element={<TestPage />} />
        <Route path="/successfully-submitted" element={<SuccessfullySubmitted />} />
        <Route path="/InstructorResults" element={<><InstructorNavbar /><InstructorResults /></>} />
        <Route path="/InstructorProfile" element={<><InstructorNavbar /><InstructorProfile /></>} />
        <Route path="/questions/:assessmentId" element={<><InstructorNavbar /><QuestionsList /></>} />
        
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/registration" element={<RegistrationForm />} /> {/* Registration Route */}
      </Routes>
    </Router>
  );
};

const AddQuestionsWrapper = () => {
  const { assessmentId } = useParams(); // useParams will work now
  return <AddQuestions assessmentId={assessmentId} />;
};

export default App;
