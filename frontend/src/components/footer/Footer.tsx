import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <Link to="/terms_of_service">Terms of Service</Link>
          <Link to="/privacy_policy">Privacy Policy</Link>
          <Link to="/cookie_policy">Cookie Policy</Link>
          <Link to="/contact" target="_blank" rel="noopener noreferrer">Contact</Link>
          <Link to="/faq">FAQ</Link>
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Dusted. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
