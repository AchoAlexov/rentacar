const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {Car, validate} = require('../models/car');

router.get('/', (req, res) => {
    Car.find()
        .then((cars) => res.status(200).send(cars))
        .catch((err) => res.status(404).send(err.message));
})

router.post('/', (req, res) => {
    const {error} = validate(req.body);
    if(error) res.status(400).send(error.message);
    
    const newCar = new Car(_.pick(req.body, ['brand', 'year','fuelType','dailyRentalFee','color']))

    newCar.save()
        .then(() => res.status(200).send('New car saved to the DB!'))
        .catch((err) => res.status(404).send(err.message));
})

module.exports = router;