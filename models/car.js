const mongoose = require('mongoose');
const Joi = require('joi');

const Car = mongoose.model('car', new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    year: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    fuelType: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    dailyRentalFee: {
        type: Number,
        required: true
    }
}));

function validateCar(car) {
    const schema = {
        brand: Joi.string().min(5).max(50).required(),
        year: Joi.number().required(),
        color: Joi.string().required(),
        fuelType: Joi.string().valid('benzin', 'diesel', 'LPG', 'methane').required(),
        dailyRentalFee: Joi.number().required()
    }

    return Joi.validate(car, schema);
}

module.exports.Car = Car;
module.exports.validate = validateCar;