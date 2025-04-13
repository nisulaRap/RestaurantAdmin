const Menu = require('../Models/menuModel');
const fs = require('fs');

const addFood = async (req, res) => {
    try {
        let image_filename = req.file.filename;

        const food = new Menu({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: image_filename,
            category: req.body.category,
            restaurantId: req.body.restaurantId
        });

        await food.save();
        res.status(200).json({ success: true, message: 'Food added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error adding food' });
    }
};


const getAllFood = async (req, res) => {
    const resturantId = req.params.resturantId;

    try {
        const foods = await Menu.find({ resturantId: resturantId });
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching food' });
    }
};

const updateFood = async (req, res) => {
    const { menuId } = req.params;
    const { name, description, price, category } = req.body;

    try {
        const food = await Menu.findById(menuId);

        if (!food) {
            return res.status(404).json({ success: false, message: 'Food not found' });
        }

        food.name = name || food.name;
        food.description = description || food.description;
        food.price = price || food.price;
        food.category = category || food.category;

        if (req.file) {
            const oldImage = food.image;
            food.image = req.file.filename;

            fs.unlink(`uploads/${oldImage}`, (err) => {
                if (err) console.error('Error deleting old image:', err);
            });
        }

        await food.save();
        res.status(200).json({ success: true, message: 'Food updated successfully', data: food });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating food' });
    }
};

const deleteFood = async (req, res) => {
    try {
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
};

const searchFood = async (req, res) => {
    const { query, resturantId } = req.query;

    try {
        const foods = await Menu.find({
            name: { $regex: query, $options: 'i' },
            resturantId
        });

        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error searching food' });
    }
};

module.exports = { addFood, getAllFood, updateFood, deleteFood, searchFood };
