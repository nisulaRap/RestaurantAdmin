import React, { useEffect, useState } from 'react';
import './Menulists.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Menulists = () => {
  const url = 'http://localhost:7001';
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const navigate = useNavigate();

  const fetchList = async () => {
    if (!restaurantId) {
      toast.warning('Please enter Restaurant ID');
      return;
    }

    try {
      const response = await axios.get(`${url}/api/menu/list/${restaurantId}`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Error fetching menu');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error');
    }
  };

  const deleteMenu = async (menuId) => {
    try {
      const response = await axios.delete(`${url}/api/menu/delete/${menuId}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error('Error deleting menu');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error');
    }
  };

  const searchFood = async () => {
    if (!restaurantId) {
      toast.warning('Enter Restaurant ID first');
      return;
    }

    try {
      const response = await axios.get(`${url}/api/menu/search?query=${search}&resturantId=${restaurantId}`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error('Search failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error');
    }
  };

  return (
    <div className="list add flex-col">
      <h3>Restaurant Menu List</h3>

      {/* Restaurant ID input */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter Restaurant ID"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
        />
        <button onClick={fetchList}>Load Menu</button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search food by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={searchFood}>Search</button>
      </div>

      {/* Table */}
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Menu Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Restaurant ID</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>Rs. {item.price}</p>
            <p>{item.resturantId}</p>
            <div>
              <p className="cursor" onClick={() => navigate(`/update/${item._id}`)}>Update</p>
              <p className="cursor" onClick={() => deleteMenu(item._id)}>Delete</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menulists;
