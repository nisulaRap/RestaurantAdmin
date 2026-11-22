import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../Components/Context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import './Login.css';
import { assets } from '../../assets/assets';
import { FiUser, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';

function Login() {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:7001/api/users/login`, 
        { name, password },
        { withCredentials: true }
      );

      const token = response.data.token;
      if (!token) {
        toast.error(response.data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      login(token, response.data.user);
      toast.success("Login successful! Welcome back.");

      const decode = response.data.user || jwtDecode(token);
      const userRole = (decode.role || '').toLowerCase();

      if (userRole === 'systemadmin') {
        navigate('/SystemAdmin');
      } else if (userRole.includes('admin') || userRole.includes('restaurant')) {
        navigate('/');
      } else if (userRole === 'deliveryperson') {
        navigate('/DeliveryPerson');
      } else if (userRole === 'customer') {
        navigate('/Customer');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    loginAsDemo();
    toast.success("Signed in with Demo Admin access! Full permissions granted.");
    navigate('/');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card-container card-box">
        <div className="login-header-group">
          <div className="brand-badge-container">
            <img src={assets.logo} alt="BigBite" className="login-brand-logo" />
          </div>
          <h2 className="login-title">Admin Portal</h2>
          <p className="login-subtitle">Sign in to manage restaurants, menus and incoming orders.</p>
        </div>

        <form onSubmit={loginForm} className="login-form-body">
          <div className="login-input-group">
            <label>Username / Account Name</label>
            <div className="input-with-icon">
              <FiUser className="input-icon" size={18} />
              <input 
                type="text" 
                placeholder="Enter admin username" 
                value={name}
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="login-input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary login-submit-btn"
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <FiArrowRight size={18} />
          </button>
        </form>

        <div className="login-security-footer">
          <FiShield size={14} />
          <span>Encrypted Session • Role-based Access Control</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
