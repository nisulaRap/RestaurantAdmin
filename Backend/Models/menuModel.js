const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    menuId: {
        type: String,
        unique: true
    },
    restaurantId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Sides', 'Pizza', 'Dessert', 'Beverage', 'Soup', 'Dish'],
        required: true
    }
});

// Generate menuId before saving
menuSchema.pre('save', async function (next) {
    if (!this.isNew || this.menuId) return next();

    try {
        const count = await this.constructor.countDocuments();
        this.menuId = `M-${String(count + 1).padStart(4, '0')}-${Date.now().toString().slice(-4)}`;
        next();
    } catch (error) {
        this.menuId = `M-${Date.now()}`;
        next();
    }
});

module.exports = mongoose.model('Menu', menuSchema);