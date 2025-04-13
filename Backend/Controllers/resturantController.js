const Resturant = require('../Models/resturantModel');
const fs = require('fs');

const addResturant = async (req, res) => {
  let image_filename = req.file.filename;

  try {
    const newResturant = new Resturant({
      resturantName: req.body.resturantName,
      resturantLocation: req.body.resturantLocation,
      resturantPhoto: image_filename,
      lat: req.body.lat,
      lng: req.body.lng,
      admin: req.body.admin,
      status: req.body.status,
    });

    await newResturant.save();

    res.status(201).json({ success: true, message: 'Restaurant added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding restaurant' });
  }
};

const getAllResturants = async (req, res) => {
  try {
    const resturants = await Resturant.find().populate('admin', 'name email');
    res.status(200).json({ success: true, data: resturants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching restaurants' });
  }
};

const getResturantById = async (req, res) => {
  try {
    const resturant = await Resturant.findById(req.params.id);
    if (!resturant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json({ success: true, data: resturant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch restaurant' });
  }
};

const updateResturant = async (req, res) => {
  const { id } = req.params;
  const { resturantName, resturantLocation, lat, lng, status, admin } = req.body;
  let updatedData = { resturantName, resturantLocation, lat, lng, status, admin };

  if (req.file) {
    let image_filename = req.file.filename;
    updatedData.resturantPhoto = image_filename;
    
    const resturant = await Resturant.findById(id);
    if (resturant && resturant.resturantPhoto) {
      fs.unlink(`uploads/${resturant.resturantPhoto}`, (err) => {
        if (err) console.error('Error deleting the old photo:', err);
      });
    }
  }

  try {
    const resturant = await Resturant.findByIdAndUpdate(id, updatedData, { new: true });
    if (!resturant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.status(200).json({ success: true, message: 'Restaurant updated successfully', data: resturant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating restaurant' });
  }
};

const deleteResturant = async (req, res) => {
  const { id } = req.params;

  try {
    const resturant = await Resturant.findByIdAndDelete(id);
    if (!resturant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (resturant.resturantPhoto) {
      fs.unlink(`uploads/${resturant.resturantPhoto}`, (err) => {
        if (err) console.error('Error deleting the photo:', err);
      });
    }

    res.status(200).json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting restaurant' });
  }
};

module.exports = {
  addResturant,
  getAllResturants,
  getResturantById,
  updateResturant,  
  deleteResturant   
};
