import React from 'react';
import './Footer.css';
import { FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="admin-footer">
      <div className="footer-content">
        <p className="copyright-text">
          © {new Date().getFullYear()} <strong>BigBite Restaurant Group</strong>. All rights reserved.
        </p>
        <div className="footer-meta">
          <span>Admin Portal Suite</span>
          <span className="dot-divider">•</span>
          <span>Fast & Secure</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
