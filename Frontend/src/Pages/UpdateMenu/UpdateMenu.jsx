import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './UpdateMenu.css';
import { 
  FiArrowLeft, 
  FiUploadCloud, 
  FiCheck, 
  FiImage 
} from 'react-icons/fi';

const UpdateMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = 'http://localhost:7001';

  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    restaurantId: ''
  });

  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${url}/api/menu/list/${id}`);
        if (res.data.success && res.data.data) {
          const { name, description, price, category, restaurantId, image } = res.data.data;
          setData({
            name: name || '',
            description: description || '',
            price: price || '',
            category: category || '',
            restaurantId: restaurantId || ''
          });
          setCurrentImage(image || '');
        } else {
          toast.error('Failed to fetch menu item');
        }
      } catch (error) {
        toast.error('Server error fetching menu details');
      }
    };

    fetchMenu();
  }, [id]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    formData.append('restaurantId', data.restaurantId);
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      const res = await axios.put(`${url}/api/menu/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        toast.success('Menu item updated successfully');
        navigate('/menulists');
      } else {
        toast.error('Failed to update menu item');
      }
    } catch (error) {
      toast.error('Server error updating item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="page-header">
        <div className="page-title-group">
          <h2>Update Menu Item</h2>
          <p className="page-subtitle">Modify details, price, category or upload a refreshed dish image.</p>
        </div>
        <Link to="/menulists" className="btn-secondary">
          <FiArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="form-card card-box">
        <form onSubmit={onSubmitHandler} className="modern-form">
          {/* Dish Image */}
          <div className="form-group upload-section">
            <label className="section-label">Dish Photograph</label>
            <label htmlFor="update-image-upload" className="image-dropzone">
              <div className="preview-container">
                <img
                  src={
                    newImage
                      ? URL.createObjectURL(newImage)
                      : currentImage
                      ? `${url}/images/${currentImage}`
                      : 'https://placehold.co/200x160?text=Upload+Photo'
                  }
                  alt="Menu Preview"
                  className="uploaded-preview"
                />
                <div className="change-overlay">
                  <FiImage size={18} />
                  <span>Click to Change Image</span>
                </div>
              </div>
            </label>
            <input
              type="file"
              id="update-image-upload"
              accept="image/*"
              hidden
              onChange={(e) => setNewImage(e.target.files[0])}
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Restaurant Outlet ID</label>
              <input
                className="form-input"
                type="text"
                name="restaurantId"
                value={data.restaurantId}
                onChange={onChangeHandler}
                required
              />
            </div>

            <div className="form-group">
              <label>Dish Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
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
                value={data.price}
                onChange={onChangeHandler}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Description</label>
            <textarea
              className="form-textarea"
              name="description"
              rows="4"
              value={data.description}
              onChange={onChangeHandler}
              required
            ></textarea>
          </div>

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
              <FiCheck size={18} />
              <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMenu;
