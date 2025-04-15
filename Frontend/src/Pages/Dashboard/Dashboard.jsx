import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const url = "http://localhost:7001";
  const [dashboardStats, setDashboardStats] = useState({
    restaurantCount: 0,
    menuCount: 0,
    orderCount: 0
  });
  const [popularMenuItems, setPopularMenuItems] = useState([]);
  const [orderTrends, setOrderTrends] = useState([]);

  useEffect(() => {
    // Fetch dashboard stats
    axios.get(`${url}/api/dashboard/stats`)
      .then(response => {
        setDashboardStats(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard stats:', error);
      });

    // Fetch popular menu items
    axios.get(`${url}/api/dashboard/popular-menu-items`)
      .then(response => {
        setPopularMenuItems(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching popular menu items:', error);
      });

    // Fetch order trends
    axios.get(`${url}/api/dashboard/order-trends`)
      .then(response => {
        setOrderTrends(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching order trends:', error);
      });
  }, []);

  const orderTrendsChartData = orderTrends.map(trend => ({
    name: trend._id,
    orderCount: trend.orderCount
  }));

  const popularMenuItemsChartData = popularMenuItems.map(item => ({
    name: item.name, 
    orderCount: item.orderCount 
  }));

  return (
    <div className='main-container'>
      <div className='main-title'>
        <h3>Dashboard</h3>
      </div>
      
      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>RESTAURANTS</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>{dashboardStats.restaurantCount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>MENU ITEMS</h3>
            <BsFillGrid3X3GapFill className='card_icon' />
          </div>
          <h1>{dashboardStats.menuCount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>ORDERS</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{dashboardStats.orderCount}</h1>
        </div>
      </div>

      <div className='charts'>
        {/* Bar chart for Popular Menu Items */}
        <ResponsiveContainer width="100%" height={300}>
          <h3 className='pmenu-items'>Popular Menu Items</h3>
          <BarChart
            data={popularMenuItemsChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orderCount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        {/* Line chart for Order Trends */}
        <ResponsiveContainer width="100%" height={300}>
          <h3 className='order-trends'>Order Trends</h3>
          <LineChart
            data={orderTrendsChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orderCount" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
