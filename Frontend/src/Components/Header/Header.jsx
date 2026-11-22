import React, { useContext, useState } from 'react';
import './Header.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { 
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiUser, 
  FiCheckCircle, 
  FiChevronDown
} from 'react-icons/fi';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setProfileDropdown(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        {/* Mobile toggle button */}
        <button 
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(prev => !prev)}
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* Brand / Logo */}
        <Link to="/" className="brand-link">
          <img src={assets.logo} alt="BigBite Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-name">BigBite</span>
            <span className="brand-badge">ADMIN</span>
          </div>
        </Link>
      </div>

      <div className="header-right">
        {/* System status pill */}
        <div className="system-status-indicator">
          <FiCheckCircle className="status-icon-dot" />
          <span>System Online</span>
        </div>

        {/* User profile / Logout */}
        {user ? (
          <div className="user-profile-wrapper">
            <button 
              className="user-profile-btn"
              onClick={() => setProfileDropdown(prev => !prev)}
            >
              <img 
                src={assets.profile} 
                alt="Profile" 
                className="user-avatar" 
              />
              <div className="user-info-text">
                <span className="user-name">{user.name || user.role || 'Admin'}</span>
                <span className="user-role">{user.role || 'Manager'}</span>
              </div>
              <FiChevronDown className={`chevron-icon ${profileDropdown ? 'open' : ''}`} />
            </button>

            {profileDropdown && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">{user.name || 'Restaurant Admin'}</p>
                  <p className="dropdown-user-role">{user.role || 'Administrator'}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-action">
                  <FiLogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-actions">
            <Link to="/login" className="btn-primary login-nav-btn">
              <FiUser size={16} />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
