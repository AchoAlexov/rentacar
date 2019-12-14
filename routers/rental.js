const express = require('express');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const router = express.Router();
const {Rental, validateRental} = require('../models/rental');
const {Car} = require('../models/car');
const {User} = require('../models/user');
const auth = require('../middleware/auth');
Fawn.init(mongoose)

router.post('/', auth, (req, res) => {
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.message);
    User.findById(req.user._id)
        .then((user) => {
            if(!user) return res.status(400).send('No user with the given id.');
            if(!user.isLoggedIn) return res.status(400).send('Current user isn`t logged in!');

            Car.findById(req.body.carId) 
                .then((car) => {
                    if(!car) return res.status(400).send('There is no car with the given id.');
                    if(!car.isAvailable) return res.status(400).send('Current car isn`t available!');

                    const newRental = new Rental({
                        rentalDays: req.body.rentalDays,
                        rentalFee: req.body.rentalDays * car.dailyRentalFee,
                        renter: {
                            name: user.name,
                            phone: user.phoneNumber,
                            _id: user._id
                        },
                        carId: car._id
                    })
                    const arr = user.currentRentals;
                    arr.push(newRental._id);
                    new Fawn.Task()
                        .save('rentals', newRental)
                        .update('cars', {_id: car._id}, {
                            $set: {
                                isAvailable: false
                            }
                        })
                        .update('users', {_id: user._id}, {
                            $set: {currentRentals: arr}
                        })
                        .run()
                        .then(() => res.send("New car rental saved to the db."))
                        .catch((err) => res.status(404).send(err))
                })
                .catch((err) => res.status(404).send(err.message));
        })
        .catch((err) => res.status(404).send(err.message));

})
module.exports = router;