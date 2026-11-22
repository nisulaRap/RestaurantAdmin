import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiPlusCircle, 
  FiList, 
  FiShoppingBag,
  FiX
} from 'react-icons/fi';
import { BiRestaurant } from 'react-icons/bi';
import { IoFastFoodOutline } from 'react-icons/io5';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose} 
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-mobile-header">
          <span className="sidebar-mobile-title">Navigation</span>
          <button className="sidebar-close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Main / Overview */}
          <div className="nav-group">
            <span className="nav-group-title">MAIN</span>
            <NavLink 
              to="/" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
              end
            >
              <div className="link-icon-box">
                <FiGrid size={18} />
              </div>
              <span>Dashboard</span>
            </NavLink>
          </div>

          {/* Restaurant Management */}
          <div className="nav-group">
            <span className="nav-group-title">RESTAURANTS</span>
            <NavLink 
              to="/addrestaurant" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <div className="link-icon-box">
                <FiPlusCircle size={18} />
              </div>
              <span>Add Restaurant</span>
            </NavLink>

            <NavLink 
              to="/restaurantlists" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <div className="link-icon-box">
                <BiRestaurant size={19} />
              </div>
              <span>Restaurant Items</span>
            </NavLink>
          </div>

          {/* Menu Management */}
          <div className="nav-group">
            <span className="nav-group-title">MENU ITEMS</span>
            <NavLink 
              to="/addmenu" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <div className="link-icon-box">
                <FiPlusCircle size={18} />
              </div>
              <span>Add Menu</span>
            </NavLink>

            <NavLink 
              to="/menulists" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <div className="link-icon-box">
                <IoFastFoodOutline size={19} />
              </div>
              <span>Menu Items</span>
            </NavLink>
          </div>

          {/* Orders */}
          <div className="nav-group">
            <span className="nav-group-title">ORDERS</span>
            <NavLink 
              to="/orders" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <div className="link-icon-box">
                <FiShoppingBag size={18} />
              </div>
              <span>Order History</span>
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="system-pill-card">
            <div className="pulse-indicator"></div>
            <div>
              <p className="card-version">BigBite Suite</p>
              <p className="card-status">v2.4 • Connected</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
