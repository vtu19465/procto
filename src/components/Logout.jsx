import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {

    localStorage.removeItem('authToken');  
    sessionStorage.removeItem('candidate'); 

    
    navigate('/');
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Logging Out...</h2>
      <p className="text-center">You will be redirected to the login page.</p>
    </div>
  );
};

export default Logout;
