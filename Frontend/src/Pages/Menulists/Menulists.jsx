import React, { useEffect, useState } from 'react';
import './Menulists.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiAlertCircle
} from 'react-icons/fi';
import { IoFastFoodOutline } from 'react-icons/io5';

const Menulists = () => {
  const url = 'http://localhost:7001';
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['All', 'Pizza', 'Sides', 'Dessert', 'Beverage', 'Soup', 'Dish'];

  const fetchAllMenus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/menu/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Error fetching menu items');
      }
    } catch (error) {
      toast.error('Server error while loading menus');
    } finally {
      setLoading(false);
    }
  };

  const deleteMenu = async (menuId, menuName) => {
    if (!window.confirm(`Are you sure you want to delete "${menuName || 'this item'}"?`)) {
      return;
    }
    try {
      const response = await axios.delete(`${url}/api/menu/delete/${menuId}`);
      if (response.data.success) {
        toast.success(response.data.message || 'Menu item removed');
        fetchAllMenus();
      } else {
        toast.error('Error deleting menu');
      }
    } catch (error) {
      toast.error('Server error deleting menu item');
    }
  };

  const searchFood = async () => {
    if (!search.trim()) {
      fetchAllMenus();
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/menu/search?query=${search}`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Search failed');
      }
    } catch (error) {
      toast.error('Server error while searching');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchFood();
    }
  };

  const clearSearch = () => {
    setSearch('');
    fetchAllMenus();
  };

  useEffect(() => {
    fetchAllMenus();
  }, []);

  const filteredList = selectedCategory === 'All'
    ? list
    : list.filter(item => item.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="menu-page-container">
      {/* Header bar */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Menu Management</h2>
          <p className="page-subtitle">Browse, search, edit or remove dishes across all categories.</p>
        </div>
        <Link to="/addmenu" className="btn-primary">
          <FiPlus size={18} />
          <span>Add New Dish</span>
        </Link>
      </div>

      {/* Control bar: Search + Category Filter */}
      <div className="menu-controls card-box">
        <div className="search-input-box">
          <FiSearch className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search dish by name, menu ID or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {search && (
            <button className="clear-search-btn" onClick={clearSearch}>
              <FiX size={16} />
            </button>
          )}
          <button className="btn-primary search-action-btn" onClick={searchFood}>
            Search
          </button>
        </div>

        {/* Category Pills */}
        <div className="category-filter-chips">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Table / Cards */}
      <div className="menu-table-card card-box">
        <div className="card-header-bar">
          <h3 className="section-title">
            Menu Items Catalog <span className="counter-pill">{filteredList.length}</span>
          </h3>
        </div>

        {/* Desktop Table View */}
        <div className="table-responsive-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Menu ID</th>
                <th>Category</th>
                <th>Price</th>
                <th>Restaurant ID</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="dish-media-cell">
                      <img
                        className="dish-thumbnail"
                        src={`${url}/images/${item.image}`}
                        alt={item.name}
                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Food'; }}
                      />
                      <div className="dish-details">
                        <span className="dish-name">{item.name}</span>
                        {item.description && (
                          <span className="dish-description-preview">{item.description}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="code-pill">#{item.menuId}</span>
                  </td>
                  <td>
                    <span className="category-badge">{item.category}</span>
                  </td>
                  <td>
                    <span className="price-tag">Rs. {Number(item.price).toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="restaurant-id-pill">{item.restaurantId}</span>
                  </td>
                  <td>
                    <div className="row-actions-group">
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/update/${item._id}`)}
                      >
                        <FiEdit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => deleteMenu(item._id, item.name)}
                      >
                        <FiTrash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="table-empty-cell">
                    <div className="empty-state-box">
                      <IoFastFoodOutline size={42} />
                      <p>No menu items found matching your filters.</p>
                      <button className="btn-secondary" onClick={clearSearch}>Reset Search</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards Grid View */}
        <div className="mobile-menu-grid">
          {filteredList.map((item, index) => (
            <div key={index} className="mobile-dish-card">
              <img
                className="mobile-dish-img"
                src={`${url}/images/${item.image}`}
                alt={item.name}
                onError={(e) => { e.target.src = 'https://placehold.co/120x100?text=Food'; }}
              />
              <div className="mobile-dish-content">
                <div className="mobile-dish-header">
                  <span className="dish-name">{item.name}</span>
                  <span className="price-tag">Rs. {Number(item.price).toLocaleString()}</span>
                </div>
                <div className="mobile-dish-meta">
                  <span className="category-badge">{item.category}</span>
                  <span className="code-pill">#{item.menuId}</span>
                </div>
                <div className="mobile-dish-actions">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/update/${item._id}`)}
                  >
                    <FiEdit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => deleteMenu(item._id, item.name)}
                  >
                    <FiTrash2 size={14} />
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

export default Menulists;
