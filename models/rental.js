const mongoose = require('mongoose');
const Joi = require('joi');

const Rental = mongoose.model('rental', new mongoose.Schema({
    dateOut: {
        type: Date,
        default: Date.now,
    },
    rentalDays: {
        type: Number,
        required: true,
    },
    rentalFee: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    renter: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            }
        }),
        required: true
    },
    carId: {
        type: String,
        required: true
    }
}));

function validate(rental) {
    const schema = {
        carId: Joi.objectId().required(),
        rentalDays: Joi.number().min(1).required()
    }

    return Joi.validate(rental, schema);
};

module.exports.Rental = Rental;
module.exports.validateRental = validate;