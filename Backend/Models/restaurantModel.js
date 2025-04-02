const mongoose = require('mongoose')

const resturantSchema = mongoose.Schema({

    resturantId: {
        type: String,
        unique: true
    },
    resturantName: {
        type: String,
        required: true
    },
    resturantLocation: {
        type: String,
        required: true
    },
    resturantPhoto: {
        type: String,
        required: true
    },
    lat: { type: String, required: true },  
    lng: { type: String, required: true },
    admin:{
        type:mongoose.Schema.ObjectId,
        ref:'UserModel',
        required:true
    },
    status:{
        type:String,
        enum:['Opened','Closed'],
        required:true,
    },
    balance:{
        type:Number,
        default:0
    },

})

// Generate resturantId before saving
resturantSchema.pre('save', async function (next) {
    if (!this.isNew) {
        return next();
    }

    try {
        const lastResturant = await this.constructor.findOne({}, {}, { sort: { 'resturantId': -1 } });
        let newResturantId = 'R-0001'; 

        if (lastResturant && lastResturant.resturantId) {
            const lastResturantIdNumber = parseInt(lastResturant.resturantId.split('-')[1], 10);
            newResturantId = `R-${String(lastResturantIdNumber + 1).padStart(4, '0')}`;
        }

        this.resturantId = newResturantId;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Resturant", resturantSchema)