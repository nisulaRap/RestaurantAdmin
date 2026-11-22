const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    restaurantId: {
        type: String,
        unique: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    restaurantLocation: {
        type: String,
        required: true
    },
    restaurantPhoto: {
        type: String,
        required: true
    },
    lat: { 
        type: String, 
        required: true 
    },
    lng: { 
        type: String, 
        required: true 
    },
    /*admin: {
        type: mongoose.Schema.ObjectId,
        ref: 'UserModel',
        required: true
    },*/
    status: {
        type: String,
        enum: ['Opened', 'Closed'],
        required: true
    },
    /*balance: {
        type: Number,
        default: 0
    }*/
});

// Generate restaurantId before saving
restaurantSchema.pre('save', async function(next) {
    if(!this.isNew || this.restaurantId) {
        return next();
    }

    try{
        const count = await this.constructor.countDocuments();
        this.restaurantId = `R-${String(count + 1).padStart(4, '0')}-${Date.now().toString().slice(-4)}`;
        next();
    } catch (error) {
        this.restaurantId = `R-${Date.now()}`;
        next();
    }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
