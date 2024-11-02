import React from 'react';
import Navbar from '../../components/navbar';
import AdminLogin from '../../components/AdminLogin';
import backgroundImage from '../../img/1331916.jpeg'; // Import your image

const LoginandRegistration = () => {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`, // Use imported image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return (
    <div style={backgroundStyle}>
      <Navbar />
      <AdminLogin/>
    </div>
  );
};

export default LoginandRegistration;
