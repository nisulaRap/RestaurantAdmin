import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

// Make sure Axios sends credentials with every request
axios.defaults.withCredentials = true;

const savedToken = localStorage.getItem('admin_token');
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error(e);
      }
    }
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        return jwtDecode(token);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    const verifyStoredToken = async () => {
      const token = localStorage.getItem('admin_token');
      try {
        const response = await axios.get('http://localhost:7001/api/users/checkToken', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        });

        if (response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        } else if (response.data && response.data.token) {
          const decoded = jwtDecode(response.data.token);
          setUser(decoded);
          localStorage.setItem('admin_user', JSON.stringify(decoded));
        }
      } catch (error) {
        console.warn('Session verification fallback to local state');
      }
    };

    verifyStoredToken();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('admin_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    let resolvedUser = userData;
    if (!resolvedUser && token) {
      try {
        resolvedUser = jwtDecode(token);
      } catch (e) {
        resolvedUser = { name: 'Admin', role: 'RestaurantAdmin' };
      }
    }
    setUser(resolvedUser);
    localStorage.setItem('admin_user', JSON.stringify(resolvedUser));
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:7001/api/users/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/login');
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
