import React, { useState, useEffect } from 'react';
import './Restaurantlists.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiMapPin, 
  FiX 
} from 'react-icons/fi';
import { BiRestaurant } from 'react-icons/bi';

const Restaurantlists = () => {
  const url = 'http://localhost:7001';
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllRestaurants = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/restaurant/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Error fetching restaurant outlets');
      }
    } catch (error) {
      toast.error('Server error while loading restaurants');
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async (restaurantId, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name || 'this restaurant'}"?`)) {
      return;
    }
    try {
      const response = await axios.delete(`${url}/api/restaurant/delete/${restaurantId}`);
      if (response.data.success) {
        toast.success(response.data.message || 'Restaurant deleted successfully');
        fetchAllRestaurants();
      } else {
        toast.error('Error deleting restaurant');
      }
    } catch (error) {
      toast.error('Server error deleting restaurant');
    }
  };

  const searchRestaurant = async () => {
    if (!search.trim()) {
      fetchAllRestaurants();
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/restaurant/search?query=${search}`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Search failed');
      }
    } catch (error) {
      toast.error('Server error searching restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchRestaurant();
    }
  };

  const clearSearch = () => {
    setSearch('');
    fetchAllRestaurants();
  };

  useEffect(() => {
    fetchAllRestaurants();
  }, []);

  return (
    <div className="restaurant-page-container">
      {/* Header bar */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Restaurant Branches</h2>
          <p className="page-subtitle">Manage registered restaurant locations, operating status and outlet details.</p>
        </div>
        <Link to="/addrestaurant" className="btn-primary">
          <FiPlus size={18} />
          <span>Add Restaurant</span>
        </Link>
      </div>

      {/* Control bar: Search */}
      <div className="restaurant-controls card-box">
        <div className="search-input-box">
          <FiSearch className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search by restaurant name or outlet ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {search && (
            <button className="clear-search-btn" onClick={clearSearch}>
              <FiX size={16} />
            </button>
          )}
          <button className="btn-primary search-action-btn" onClick={searchRestaurant}>
            Search
          </button>
        </div>
      </div>

      {/* Restaurant List Card */}
      <div className="restaurant-table-card card-box">
        <div className="card-header-bar">
          <h3 className="section-title">
            Registered Outlets <span className="counter-pill">{list.length}</span>
          </h3>
        </div>

        {/* Desktop Table View */}
        <div className="table-responsive-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Outlet ID</th>
                <th>Location</th>
                <th>Coordinates</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="restaurant-media-cell">
                      <img 
                        className="restaurant-thumbnail" 
                        src={`${url}/images/${item.restaurantPhoto}`} 
                        alt={item.restaurantName}
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Branch'; }}
                      />
                      <span className="restaurant-name">{item.restaurantName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="code-pill">#{item.restaurantId}</span>
                  </td>
                  <td>
                    <div className="location-cell">
                      <FiMapPin size={14} className="location-pin-icon" />
                      <span>{item.restaurantLocation}</span>
                    </div>
                  </td>
                  <td>
                    <span className="coord-text">
                      {item.lat && item.lng ? `${item.lat}, ${item.lng}` : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${item.status === 'Opened' ? 'status-opened' : 'status-closed'}`}>
                      {item.status || 'Opened'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions-group">
                      <button 
                        className="btn-edit"
                        onClick={() => navigate(`/updaterestaurant/${item._id}`)}
                      >
                        <FiEdit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => deleteRestaurant(item._id, item.restaurantName)}
                      >
                        <FiTrash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="table-empty-cell">
                    <div className="empty-state-box">
                      <BiRestaurant size={42} />
                      <p>No restaurant branches found.</p>
                      <button className="btn-secondary" onClick={clearSearch}>Reset Search</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards Grid View */}
        <div className="mobile-restaurant-grid">
          {list.map((item, index) => (
            <div key={index} className="mobile-restaurant-card">
              <img 
                className="mobile-restaurant-img" 
                src={`${url}/images/${item.restaurantPhoto}`} 
                alt={item.restaurantName}
                onError={(e) => { e.target.src = 'https://placehold.co/120x100?text=Branch'; }}
              />
              <div className="mobile-restaurant-content">
                <div className="mobile-rest-top">
                  <span className="restaurant-name">{item.restaurantName}</span>
                  <span className={`status-pill ${item.status === 'Opened' ? 'status-opened' : 'status-closed'}`}>
                    {item.status || 'Opened'}
                  </span>
                </div>
                <div className="location-cell">
                  <FiMapPin size={13} />
                  <span>{item.restaurantLocation}</span>
                </div>
                <span className="code-pill">ID: #{item.restaurantId}</span>
                <div className="mobile-dish-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => navigate(`/updaterestaurant/${item._id}`)}
                  >
                    <FiEdit2 size={13} />
                    <span>Edit</span>
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={() => deleteRestaurant(item._id, item.restaurantName)}
                  >
                    <FiTrash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurantlists;
