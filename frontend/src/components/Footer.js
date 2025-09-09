import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <img src={logo} alt="Pearlora Logo" className="footer-logo" />
          <div className="brand-name">pearlora.</div>
          <p className="footer-tagline">Made with ❤️ to manage your celebrations with magic</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li><Link to="/help">Help/FAQ</Link></li>
              <li><Link to="/contact">Call Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>More</h4>
            <ul>
              <li><Link to="/feedback">Feedback</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Discover The World</h4>
            <div className="app-links">
              <Link to="/app-store">
                <img src="/images/app-store.png" alt="App Store" />
              </Link>
              <Link to="/play-store">
                <img src="/images/play-store.png" alt="Play Store" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;