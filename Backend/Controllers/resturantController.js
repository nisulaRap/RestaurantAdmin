const Resturant = require('../Models/resturantModel');
const express = require('express');
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
    res.status(200).json({ success: false, data: resturant });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch restaurant' });
  }
};

module.exports = {
  addResturant,
  getAllResturants,
  getResturantById
};