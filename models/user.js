const mongoose = require('mongoose');
const Joi = require('Joi');
const PasswordComplexity = require('joi-password-complexity');

const User = mongoose.model('user', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
    rentalsHistory: {
        type: Array
    },
    currentRentals: {
        type: Array
    }
    
}));

function validate(user) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(10).max(255).required(),
        phoneNumber: Joi.string().min(10).max(50).required(),
        password: Joi.string().required()
    }

    const result = Joi.validate(user.password, new PasswordComplexity({
        min: 3,
        max: 26,
        lowerCase: 1,
        upperCase: 0,
        numeric: 0,
        symbol: 0,
        requirementCount: 4,
    }))

    if(result.error) {
        return result;
    } else {
        return Joi.validate(user, schema);
    }
};

module.exports.User = User;
module.exports.validateUser = validate;
