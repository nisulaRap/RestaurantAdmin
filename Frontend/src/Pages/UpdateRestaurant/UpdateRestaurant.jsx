import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UpdateRestaurant.css';
import { 
  FiArrowLeft, 
  FiCheck, 
  FiImage 
} from 'react-icons/fi';

const UpdateRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = 'http://localhost:7001';

  const [data, setData] = useState({
    restaurantName: '', 
    restaurantLocation: '', 
    lat: '', 
    lng: '', 
    status: ''
  });

  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`${url}/api/restaurant/list/${id}`);
        if (res.data.success && res.data.data) {
          const { restaurantName, restaurantLocation, lat, lng, status, restaurantPhoto } = res.data.data;
          setData({
            restaurantName: restaurantName || '',
            restaurantLocation: restaurantLocation || '',
            lat: lat || '',
            lng: lng || '',
            status: status || 'Opened'
          });
          setCurrentImage(restaurantPhoto || '');
        } else {
          toast.error('Failed to fetch restaurant details');
        }
      } catch (error) {
        toast.error('Server error fetching restaurant details');
      }
    };

    fetchRestaurant();
  }, [id]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('restaurantName', data.restaurantName);
    formData.append('restaurantLocation', data.restaurantLocation);
    formData.append('lat', data.lat);
    formData.append('lng', data.lng);
    formData.append('status', data.status);

    if (newImage) {
      formData.append('restaurantPhoto', newImage);
    }

    try {
      const res = await axios.put(`${url}/api/restaurant/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success('Restaurant updated successfully');
        navigate('/restaurantlists');
      } else {
        toast.error('Failed to update restaurant');
      }
    } catch (error) {
      toast.error('Server error updating restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="page-header">
        <div className="page-title-group">
          <h2>Update Restaurant Branch</h2>
          <p className="page-subtitle">Modify location, operating status, or upload a new photo.</p>
        </div>
        <Link to="/restaurantlists" className="btn-secondary">
          <FiArrowLeft size={16} />
          <span>Back to Branches</span>
        </Link>
      </div>

      <div className="form-card card-box">
        <form onSubmit={onSubmitHandler} className="modern-form">
          <div className="form-group upload-section">
            <label className="section-label">Restaurant Photo</label>
            <label htmlFor="update-rest-image" className="image-dropzone">
              <div className="preview-container">
                <img
                  src={
                    newImage 
                      ? URL.createObjectURL(newImage) 
                      : currentImage 
                      ? `${url}/images/${currentImage}` 
                      : 'https://placehold.co/200x160?text=Branch+Photo'
                  }
                  alt="Restaurant Preview"
                  className="uploaded-preview"
                />
                <div className="change-overlay">
                  <FiImage size={18} />
                  <span>Click to Change Photo</span>
                </div>
              </div>
            </label>
            <input 
              type="file"
              id="update-rest-image"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files[0])}
              hidden
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Restaurant Name</label>
              <input
                className="form-input"
                type="text"
                name="restaurantName"
                value={data.restaurantName}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="form-group">
              <label>Restaurant Location</label>
              <input
                className="form-input"
                type="text"
                name="restaurantLocation"
                value={data.restaurantLocation}
                onChange={onChangeHandler}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Latitude</label>
              <input 
                className="form-input"
                type="text" 
                name="lat" 
                value={data.lat} 
                onChange={onChangeHandler} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input 
                className="form-input"
                type="text" 
                name="lng" 
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
              <option value="Opened">Opened</option>
              <option value="Closed">Closed</option>
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
              <FiCheck size={18} />
              <span>{loading ? 'Saving...' : 'Update Restaurant'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRestaurant;
