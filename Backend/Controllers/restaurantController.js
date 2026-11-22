const Restaurant = require('../Models/restaurantModel');
const fs = require('fs');

const addRestaurant = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a restaurant photo (JPG, PNG, or WEBP under 10MB)' });
    }

    let image_filename = req.file.filename;
    const { restaurantName, restaurantLocation, lat, lng, status } = req.body; 
    
    if (!restaurantName || !restaurantLocation) {
      return res.status(400).json({ success: false, message: 'Restaurant name and location are required' });
    }

    // Auto-generate unique restaurantId safely
    const count = await Restaurant.countDocuments();
    const generatedId = `R-${String(count + 1).padStart(4, '0')}-${Date.now().toString().slice(-4)}`;

    const newRestaurant = new Restaurant({
      restaurantId: generatedId,
      restaurantName: restaurantName.trim(),
      restaurantLocation: restaurantLocation.trim(),
      restaurantPhoto: image_filename,
      lat: lat ? String(lat).trim() : "6.9271",
      lng: lng ? String(lng).trim() : "79.8612",
      status: status || 'Opened',
    });

    await newRestaurant.save();

    res.status(201).json({ success: true, message: 'Restaurant added successfully', data: newRestaurant });
  } catch (error) {
    console.error('Error while saving restaurant:', error);
    res.status(500).json({ success: false, message: error.message || 'Error adding restaurant' });
  }
};

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
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
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateRestaurant = async (req, res) => {

  const { restaurantName, restaurantLocation, lat, lng, status } = req.body;

  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    restaurant.restaurantName = restaurantName || restaurant.restaurantName;
    restaurant.restaurantLocation = restaurantLocation || restaurant.restaurantLocation;
    restaurant.lat = lat || restaurant.lat;
    restaurant.lng = lng || restaurant.lng;
    restaurant.status = status || restaurant.status;

    if (req.file) {
      const oldImage = restaurant.restaurantPhoto;
      restaurant.restaurantPhoto = req.file.filename;

      // Delete the old image file
      fs.unlink(`uploads/${oldImage}`, (err) => {
        if (err) console.error('Error deleting the old photo:', err);
      });
    }

    await restaurant.save();
    res.status(200).json({ success: true, message: 'Restaurant updated successfully', data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating restaurant' });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    fs.unlink(`uploads/${restaurant.restaurantPhoto}`, () => {});

    res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting restaurant' });
  }
};

const searchRestaurant = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(200).json({ success: true, data: [] });
  }
  
  let searchFilter = {
    $or: [
      { restaurantName: { $regex: query, $options: 'i' } },
      { restaurantId: { $regex: query, $options: 'i' } },
    ],
  };

  try {
    const restaurants = await Restaurant.find(searchFilter);
    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching for restaurant' });
  }
}

module.exports = { addRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant, searchRestaurant };
