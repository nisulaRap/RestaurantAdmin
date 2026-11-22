const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["SystemAdmin", "RestaurantAdmin", "DeliveryPerson", "Customer"],
        default: "Customer"
    },

    photo: {
        type: String
    },

    // Only required for RestaurantAdmin
    restaurantName: {
        type: String,
        required: function () {
            return this.role === "RestaurantAdmin";
        },
        trim: true
    }

});

module.exports = mongoose.model("UserModel", userSchema);
