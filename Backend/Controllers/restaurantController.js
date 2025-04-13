const Restaurant = require('../Models/restaurantModel');
const fs = require('fs');

const addRestaurant = async (req, res) => {
  let image_filename = req.file.filename;

  try {
    const { restaurantName, restaurantLocation, lat, lng, status } = req.body; 
    
    if (!restaurantName || !restaurantLocation || !lat || !lng || !status) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newRestaurant = new Restaurant({
      restaurantName,
      restaurantLocation,
      restaurantPhoto: image_filename,
      lat,
      lng,
      status,
    });

    await newRestaurant.save();

    res.status(201).json({ success: true, message: 'Restaurant added successfully' });
  } catch (error) {
    console.error('Error while saving restaurant:', error.message);
    res.status(500).json({ success: false, message: 'Error adding restaurant', error: error.message });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    
    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({ success: false, message: 'No restaurants found' });
    }

    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching restaurants', error: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch restaurant' });
  }
};

const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { restaurantName, restaurantLocation, lat, lng, status, admin } = req.body;
  let updatedData = { restaurantName, restaurantLocation, lat, lng, status, admin };

  if (req.file) {
    let image_filename = req.file.filename;
    updatedData.restaurantPhoto = image_filename;
    
    const restaurant = await Restaurant.findById(id);
    if (restaurant && restaurant.restaurantPhoto) {
      fs.unlink(`uploads/${restaurant.restaurantPhoto}`, (err) => {
        if (err) console.error('Error deleting the old photo:', err);
      });
    }
  }

  try {
    const restaurant = await Restaurant.findByIdAndUpdate(id, updatedData, { new: true });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.status(200).json({ success: true, message: 'Restaurant updated successfully', data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating restaurant' });
  }
};

const deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (restaurant.restaurantPhoto) {
      fs.unlink(`uploads/${restaurant.restaurantPhoto}`, (err) => {
        if (err) console.error('Error deleting the photo:', err);
      });
    }

    res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting restaurant' });
  }
};

module.exports = {
  addRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,  
  deleteRestaurant   
};
