const Menu = require('../Models/menuModel');
const express = require('express');
const fs = require('fs');

const addFood = async (req, res) => {
    let image_filename = req.file.filename;

    const food = new Menu({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image_filename,
        category: req.body.category,
    });

    try {
        await food.save();
        res.status(200).json({ succes: true, message: 'Food added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error adding food' });
    }
}

const getAllFood = async (req, res) => {
    try {
        const foods = await Menu.find({});
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching food' });
    }

}

const deleteFood = async (req, res) => {
    try{
        const food = await Menu.findByIdAndDelete(req.params.id);
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food not found' });
        }
        fs.unlink(`uploads/${food.image}`, () => {});
        
        res.status(200).json({ success: true, message: 'Food deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting food' });
    }
}

module.exports = { addFood, getAllFood, deleteFood };