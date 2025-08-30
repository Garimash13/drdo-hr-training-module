import React from 'react';
import './Navbar.css'; // Make sure this path is correct based on your folder structure

const Navbar = () => {
  return (
    <div className="navbar">
      <img src="/drdo-logo.png" alt="DRDO Logo" className="logo" />
      <div className="navbar-texts">
        <div className="main-title">Solid State Physics Laboratory (SSPL)</div>
        <div className="sub-title">Defence Research and Development Organisation</div>
      </div>
    </div>
  );
};

export default Navbar;





