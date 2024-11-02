import React from 'react';
import CandidateNavbar from '../../components/candidateNavbar';
import AssessmentsList from '../../components/candidateExams';

const CandidateDashboard = () => {
  return (
    <div>
     <CandidateNavbar/>
     <AssessmentsList/>
    </div>
  );
};

export default CandidateDashboard;
