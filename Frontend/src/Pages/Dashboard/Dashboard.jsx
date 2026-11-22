import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  FiShoppingBag,
  FiDownload,
  FiTrendingUp,
  FiClock,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import { BiRestaurant } from 'react-icons/bi';
import { IoFastFoodOutline } from 'react-icons/io5';

const Dashboard = () => {
  const url = "http://localhost:7001";
  const [dashboardStats, setDashboardStats] = useState({
    restaurantCount: 0,
    menuCount: 0,
    orderCount: 0
  });
  const [popularMenuItems, setPopularMenuItems] = useState([]);
  const [orderTrends, setOrderTrends] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.put(`${url}/api/order/${orderId}/status`, {
        orderStatus: newStatus
      });

      if (response.data.success) {
        toast.success(`Order #${orderId} set to ${newStatus}`);
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [statsRes, menuRes, trendsRes, ordersRes] = await Promise.allSettled([
          axios.get(`${url}/api/dashboard/stats`),
          axios.get(`${url}/api/dashboard/popular-menu-items`),
          axios.get(`${url}/api/dashboard/order-trends`),
          axios.get(`${url}/api/order/list`)
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
          setDashboardStats(statsRes.value.data.data);
        }
        if (menuRes.status === 'fulfilled' && menuRes.value.data.success) {
          setPopularMenuItems(menuRes.value.data.data);
        }
        if (trendsRes.status === 'fulfilled' && trendsRes.value.data.success) {
          setOrderTrends(trendsRes.value.data.data);
        }
        if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
          setOrders(ordersRes.value.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const orderTrendsChartData = orderTrends.map(trend => ({
    name: trend._id,
    orderCount: trend.orderCount
  }));

  const popularMenuItemsChartData = popularMenuItems.map(item => ({
    name: item.itemName,
    orderCount: item.count
  }));

  const handleDownloadReport = () => {
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

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-banner card-box">
        <div className="welcome-text">
          <div className="welcome-badge">
            <FiCheckCircle size={14} />
            <span>Overview & Real-time Metrics</span>
          </div>
          <h2>Welcome back, Restaurant Admin !</h2>
          <p className="welcome-subtext">
            Monitor branch performance, track real-time orders and manage menu items from one unified hub.
          </p>
        </div>
        <div className="welcome-actions">
          <button onClick={handleDownloadReport} className="btn-primary report-btn">
            <FiDownload size={16} />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="metrics-grid">
        <div className="metric-card card-box card-blue">
          <div className="metric-header">
            <div className="metric-icon-box bg-blue-soft">
              <BiRestaurant size={26} className="text-blue" />
            </div>
            <span className="metric-pill">Active Outlets</span>
          </div>
          <div className="metric-body">
            <h3 className="metric-number">{dashboardStats.restaurantCount}</h3>
            <p className="metric-label">Registered Restaurants</p>
          </div>
          <div className="metric-footer">
            <Link to="/restaurantlists" className="metric-link">
              <span>View all branches</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="metric-card card-box card-orange">
          <div className="metric-header">
            <div className="metric-icon-box bg-orange-soft">
              <IoFastFoodOutline size={26} className="text-orange" />
            </div>
            <span className="metric-pill">Active Menu</span>
          </div>
          <div className="metric-body">
            <h3 className="metric-number">{dashboardStats.menuCount}</h3>
            <p className="metric-label">Menu Items Catalog</p>
          </div>
          <div className="metric-footer">
            <Link to="/menulists" className="metric-link">
              <span>Manage catalog</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="metric-card card-box card-emerald">
          <div className="metric-header">
            <div className="metric-icon-box bg-emerald-soft">
              <FiShoppingBag size={26} className="text-emerald" />
            </div>
            <span className="metric-pill">Total Orders</span>
          </div>
          <div className="metric-body">
            <h3 className="metric-number">{dashboardStats.orderCount}</h3>
            <p className="metric-label">Lifetime Order Records</p>
          </div>
          <div className="metric-footer">
            <Link to="/orders" className="metric-link">
              <span>Inspect order history</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="charts-grid">
        <div className="chart-card card-box">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Popular Menu Items</h3>
              <p className="chart-subtitle">Top ordered dishes across all branches</p>
            </div>
            <span className="chart-tag">By Order Count</span>
          </div>
          <div className="chart-body">
            {popularMenuItemsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={popularMenuItemsChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="orderCount" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty-state">
                <FiTrendingUp size={36} />
                <p>No popular menu data recorded yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card card-box">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-title">Order Trends</h3>
              <p className="chart-subtitle">Order volume activity trajectory</p>
            </div>
            <span className="chart-tag">Trends</span>
          </div>
          <div className="chart-body">
            {orderTrendsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={orderTrendsChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orderCount"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty-state">
                <FiClock size={36} />
                <p>No trend points accumulated yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="orders-section card-box">
        <div className="orders-section-header">
          <div>
            <h3 className="section-title">Recent Orders</h3>
            <p className="section-subtitle">Real-time order feed and instant status management</p>
          </div>
          <Link to="/orders" className="btn-secondary view-all-link">
            <span>View All</span>
            <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Desktop Data Table */}
        <div className="orders-table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Ordered Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 7).map((order, index) => (
                <tr key={index}>
                  <td className="font-semibold text-main">
                    <span className="order-id-chip">#{order.orderId}</span>
                  </td>
                  <td>
                    <span className="customer-id-text">{order.customerId}</span>
                  </td>
                  <td>
                    <div className="order-items-snippet">
                      {order.items?.map((item, itemIdx) => (
                        <span key={itemIdx} className="item-chip">
                          {item.itemName} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="order-total-cell">Rs. {Number(order.totalAmount).toLocaleString()}</td>
                  <td>
                    <span className={`status-pill ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select-input"
                      value={order.orderStatus}
                      onChange={(e) => statusHandler(e, order.orderId)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="ReadyToDeliver">Ready To Deliver</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="table-empty-cell">
                    No active orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Orders Card View */}
        <div className="mobile-orders-cards">
          {orders.slice(0, 7).map((order, index) => (
            <div key={index} className="mobile-order-card">
              <div className="mobile-order-top">
                <span className="order-id-chip">#{order.orderId}</span>
                <span className={`status-pill ${getStatusClass(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="mobile-order-info">
                <p><strong>Customer:</strong> {order.customerId}</p>
                <div className="mobile-order-items">
                  {order.items?.map((item, i) => (
                    <span key={i} className="item-chip">{item.itemName} × {item.quantity}</span>
                  ))}
                </div>
                <p className="mobile-order-total">
                  Total: <strong>Rs. {Number(order.totalAmount).toLocaleString()}</strong>
                </p>
              </div>
              <div className="mobile-order-action">
                <label>Update Status:</label>
                <select
                  className="status-select-input"
                  value={order.orderStatus}
                  onChange={(e) => statusHandler(e, order.orderId)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="ReadyToDeliver">Ready To Deliver</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
