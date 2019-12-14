require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const user = require('./routers/user');
const car = require('./routers/car');
const rental = require('./routers/rental');

if(!process.env.RENTACARKEY) {
    console.error("FATAL ERROR: rentacarKey is not defined!");
    process.exit(1);
}

app.use(express.json());
app.use('/user', user);
app.use('/car', car);
app.use('/rental', rental);

mongoose.connect('mongodb://localhost/rentacar',{useNewUrlParser:true, useUnifiedTopology: true})
    .then(() => console.log('Connected to rentacar db...'))
    .catch((err) => console.log(err.message));

const port = process.env.PORT || 7000;
app.listen(port, () => console.log(`Listening on port ${port}!`));
