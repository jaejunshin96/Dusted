import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <Link to="/terms_of_service" onClick={handleLinkClick}>Terms of Service</Link>
          <Link to="/privacy_policy" onClick={handleLinkClick}>Privacy Policy</Link>
          <Link to="/cookie_policy" onClick={handleLinkClick}>Cookie Policy</Link>
          <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
          <Link to="/faq" onClick={handleLinkClick}>FAQ</Link>
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
