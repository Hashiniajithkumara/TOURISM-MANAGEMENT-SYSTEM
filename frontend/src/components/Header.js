import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

function Header() {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Pearlora Logo" className="logo" />
          </Link>
          <div className="brand-name">PEARLORA</div>
        </div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">HOME</Link></li>
            <li><Link to="/bookings">BOOKINGS</Link></li>
            <li><Link to="/about">ABOUT</Link></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/chat" className="chat-btn">Let's Talk</Link>
          <Link to="/login" className="login-btn">Sign In / Sign Up</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;