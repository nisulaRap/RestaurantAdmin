const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    orderId: {
        type: String,
        unique: true
    },
    
    cartId: {
        type: String,
        required: true
    },

    customerId: {
        type: String,
        required: true
    },

    restaurantId: {
        type: String,
        required: true
    },

    customerEmail: {
        type: String,
        required: true
    },

    items: [
        {
            itemId: {
                type: String,
                required: true
            },

            itemName: {
                type: String,
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            },

            price: {
                type: Number,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },

    paymentMethod: {
        type: String,
        enum: ['Card'],
        required: true
    },

    orderStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'ReadyToDeliver', 'OrderAssigned', 'DeliverAccepted','OutForDelivery/DriverOnTheWay', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },

    deliveryLocation: {
        type: String,
        required: true
    },

    deliveryPersonId: {
        type: String,
    },

    orderTime: {
        type: Date,
        default: Date.now
    },

    deliveredTime: {
        type: Date
    },

    notes: {
        type: String
    }

});

// Generate orderId before saving
orderSchema.pre('save', async function (next) {
    if (!this.isNew || this.orderId) {
        return next();
    }

    try {
        const count = await this.constructor.countDocuments();
        this.orderId = `O-${String(count + 1).padStart(4, '0')}-${Date.now().toString().slice(-4)}`;
        next();
    } catch (err) {
        this.orderId = `O-${Date.now()}`;
        next();
    }
});

module.exports = mongoose.model("Order", orderSchema);