import React, { useState } from 'react';
import './AddMenu.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUploadCloud,
  FiArrowLeft,
  FiPlus,
  FiCheck,
  FiImage
} from 'react-icons/fi';

const Addmenu = () => {
  const url = "http://localhost:7001";
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    restaurantId: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please upload a dish image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', data.name.trim());
    formData.append('description', data.description ? data.description.trim() : '');
    formData.append('category', data.category);
    formData.append('price', Number(data.price));
    formData.append('restaurantId', data.restaurantId ? data.restaurantId.trim() : 'DEFAULT');

    try {
      const response = await axios.post(`${url}/api/menu/add`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        toast.success(response.data.message || "Menu item added successfully!");
        setData({
          name: "",
          description: "",
          category: "",
          price: "",
          restaurantId: ""
        });
        setImage(null);
        navigate('/menulists');
      } else {
        toast.error(response.data.message || "Failed to add menu item");
      }
    } catch (error) {
      console.error('Add Menu Error:', error);
      toast.error(error.response?.data?.message || error.message || "Something went wrong while adding food item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Add New Menu Item</h2>
          <p className="page-subtitle">Publish a new dish with high-resolution photo, pricing and category.</p>
        </div>
        <Link to="/menulists" className="btn-secondary">
          <FiArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Form Card */}
      <div className="form-card card-box">
        <form onSubmit={onSubmitHandler} className="modern-form">
          {/* Image Upload Dropzone */}
          <div className="form-group upload-section">
            <label className="section-label">Dish Photograph</label>
            <label htmlFor="menu-image-upload" className="image-dropzone">
              {image ? (
                <div className="preview-container">
                  <img src={URL.createObjectURL(image)} alt="Preview" className="uploaded-preview" />
                  <div className="change-overlay">
                    <FiImage size={18} />
                    <span>Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="dropzone-placeholder">
                  <div className="upload-icon-circle">
                    <FiUploadCloud size={28} />
                  </div>
                  <p className="upload-title">Click or drag image here to upload</p>
                  <p className="upload-hint">Supported formats: JPG, PNG, WEBP (Max 5MB)</p>
                </div>
              )}
            </label>
            <input
              type="file"
              id="menu-image-upload"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Input Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label>Restaurant Outlet ID</label>
              <input
                className="form-input"
                type="text"
                name="restaurantId"
                placeholder="e.g. REST01"
                value={data.restaurantId}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="form-group">
              <label>Dish / Product Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="e.g. Margherita Thin Crust Pizza"
                value={data.name}
                onChange={onChangeHandler}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-select"
                name="category"
                value={data.category}
                onChange={onChangeHandler}
                required
              >
                <option value="">Select Category</option>
                <option value="Pizza">Pizza</option>
                <option value="Sides">Sides</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
                <option value="Soup">Soup</option>
                <option value="Dish">Dish</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price (Rs.)</label>
              <input
                className="form-input"
                type="number"
                name="price"
                placeholder="e.g. 1450"
                value={data.price}
                onChange={onChangeHandler}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Detailed Description</label>
            <textarea
              className="form-textarea"
              name="description"
              rows="4"
              placeholder="Describe ingredients, flavor profile and portion details..."
              value={data.description}
              onChange={onChangeHandler}
              required
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="form-actions-bar">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/menulists')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary submit-btn"
              disabled={loading}
            >
              <FiPlus size={18} />
              <span>{loading ? 'Adding Dish...' : 'Publish Dish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addmenu;
