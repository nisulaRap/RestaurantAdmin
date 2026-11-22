import React, { useState } from 'react';
import './AddRestaurant.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUploadCloud, 
  FiArrowLeft, 
  FiPlus, 
  FiImage 
} from 'react-icons/fi';

const AddRestaurant = () => {
  const url = "http://localhost:7001";
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    restaurantName: "",
    restaurantLocation: "",
    lat: "",
    lng: "",
    status: "Opened"
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please upload a restaurant photo.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('restaurantPhoto', image);
    formData.append('restaurantName', data.restaurantName);
    formData.append('restaurantLocation', data.restaurantLocation);  
    formData.append('lat', data.lat);
    formData.append('lng', data.lng);
    formData.append('status', data.status);

    try {
      const response = await axios.post(`${url}/api/restaurant/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        toast.success(response.data.message || "Restaurant registered successfully!");
        setData({
          restaurantName: "",
          restaurantLocation: "",
          lat: "",
          lng: "",
          status: "Opened"
        });
        setImage(null);
        navigate('/restaurantlists');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding restaurant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="page-header">
        <div className="page-title-group">
          <h2>Add New Restaurant</h2>
          <p className="page-subtitle">Register a branch outlet with location details and operating status.</p>
        </div>
        <Link to="/restaurantlists" className="btn-secondary">
          <FiArrowLeft size={16} />
          <span>Back to Branches</span>
        </Link>
      </div>

      <div className="form-card card-box">
        <form onSubmit={onSubmitHandler} className="modern-form">
          {/* Restaurant Photo Upload */}
          <div className="form-group upload-section">
            <label className="section-label">Restaurant Photo</label>
            <label htmlFor="restaurant-image-upload" className="image-dropzone">
              {image ? (
                <div className="preview-container">
                  <img src={URL.createObjectURL(image)} alt="Preview" className="uploaded-preview" />
                  <div className="change-overlay">
                    <FiImage size={18} />
                    <span>Change Photo</span>
                  </div>
                </div>
              ) : (
                <div className="dropzone-placeholder">
                  <div className="upload-icon-circle">
                    <FiUploadCloud size={28} />
                  </div>
                  <p className="upload-title">Click to upload restaurant storefront / interior</p>
                  <p className="upload-hint">Supported formats: JPG, PNG, WEBP</p>
                </div>
              )}
            </label>
            <input 
              type="file" 
              id="restaurant-image-upload"
              accept="image/*"
              hidden 
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Restaurant Name</label>
              <input
                className="form-input"
                type="text" 
                name="restaurantName" 
                placeholder="e.g. BigBite Colombo Flagship" 
                value={data.restaurantName}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="form-group">
              <label>Restaurant Location / Address</label>
              <input
                className="form-input"
                type="text" 
                name="restaurantLocation" 
                placeholder="e.g. Galle Road, Colombo 03" 
                value={data.restaurantLocation}
                onChange={onChangeHandler}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Latitude Coordinates</label>
              <input
                className="form-input"
                type="text" 
                name="lat" 
                placeholder="e.g. 6.9271" 
                value={data.lat}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="form-group">
              <label>Longitude Coordinates</label>
              <input
                className="form-input"
                type="text" 
                name="lng" 
                placeholder="e.g. 79.8612" 
                value={data.lng}
                onChange={onChangeHandler}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Operating Status</label>
            <select
              className="form-select"
              name="status"
              value={data.status}
              onChange={onChangeHandler}
              required
            >
              <option value="Opened">Opened (Accepting orders)</option>
              <option value="Closed">Closed (Temporarily offline)</option>
            </select>
          </div>

          <div className="form-actions-bar">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate('/restaurantlists')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary submit-btn"
              disabled={loading}
            >
              <FiPlus size={18} />
              <span>{loading ? 'Registering...' : 'Register Restaurant'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;
