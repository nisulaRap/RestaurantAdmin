import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import {
  FiDownload,
  FiClock,
  FiShoppingBag,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

const Orders = () => {
  const url = "http://localhost:7001";
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Server error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.put(`${url}/api/order/${orderId}/status`, {
        orderStatus: newStatus
      }, { withCredentials: true });

      if (response.data.success) {
        toast.success(`Order #${orderId} marked as ${newStatus}`);
        await fetchAllOrders();
      } else {
        toast.error("Status update failed");
      }
    } catch (error) {
      toast.error("Error communicating with server");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleDownload = () => {
    window.open(`${url}/api/report/download-report`, '_blank');
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'preparing': return 'status-preparing';
      case 'readytodeliver': return 'status-ready';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const statuses = ['All', 'Pending', 'Confirmed', 'Preparing', 'ReadyToDeliver', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.orderStatus?.toLowerCase() === filterStatus.toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query ||
      String(order.orderId).toLowerCase().includes(query) ||
      String(order.customerId).toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="orders-page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Order History & Management</h2>
          <p className="page-subtitle">Track incoming food orders, update cooking stages and export reports.</p>
        </div>
        <button onClick={handleDownload} className="btn-primary">
          <FiDownload size={16} />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="orders-control-bar card-box">
        <div className="orders-search-box">
          <FiSearch size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="orders-status-filters">
          {statuses.map((status, idx) => (
            <button
              key={idx}
              className={`filter-chip ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="orders-list-card card-box">
        <div className="card-header-bar">
          <h3 className="section-title">
            Live Orders <span className="counter-pill">{filteredOrders.length}</span>
          </h3>
        </div>

        <div className="orders-stack">
          {filteredOrders.map((order, index) => (
            <div key={index} className="modern-order-item">
              <div className="order-left-media">
                <div className="parcel-avatar">
                  <FiShoppingBag size={24} />
                </div>
              </div>

              <div className="order-main-info">
                <div className="order-title-row">
                  <span className="order-id-badge">Order #{order.orderId}</span>
                  <span className={`status-pill ${getStatusClass(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="order-meta-grid">
                  <p><strong>Customer ID:</strong> {order.customerId}</p>
                  <p><strong>Payment Status:</strong> <span className="payment-chip">{order.paymentStatus || 'Paid'}</span></p>
                  <p className="order-time-text">
                    <FiClock size={13} />
                    <span>{new Date(order.orderTime).toLocaleString()}</span>
                  </p>
                </div>

                <div className="order-items-wrapper">
                  <span className="items-label">Ordered Dishes:</span>
                  <div className="items-chips-group">
                    {order.items?.map((item, itemIndex) => (
                      <span key={itemIndex} className="order-dish-pill">
                        {item.itemName} <strong className="dish-qty">× {item.quantity}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="order-actions-column">
                <div className="order-price-box">
                  <span className="price-sub">Total Amount</span>
                  <span className="price-val">Rs. {Number(order.totalAmount).toLocaleString()}</span>
                </div>

                <div className="status-changer-box">
                  <label>Change Stage:</label>
                  <select
                    className="order-status-dropdown"
                    onChange={(event) => statusHandler(event, order.orderId)}
                    value={order.orderStatus}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="ReadyToDeliver">Ready To Deliver</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && !loading && (
            <div className="empty-state-box">
              <FiShoppingBag size={46} />
              <p>No orders match your active filter.</p>
              <button className="btn-secondary" onClick={() => { setFilterStatus('All'); setSearchTerm(''); }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
