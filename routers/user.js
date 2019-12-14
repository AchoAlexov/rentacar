const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {User, validateUser} = require('../models/user');
const auth = require('../middleware/auth');

router.post('/', (req, res) => {
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.message);

    User.findOne({email: req.body.email})
        .then((user) => {
            if(user) return res.status(400).send('Unavailable username or password!');
            const newUser = new User(_.pick(req.body, ['name', 'email', 'password', 'phoneNumber']));
            bcrypt.genSalt(10)
                .then((salt) => {
                    bcrypt.hash(newUser.password, salt)
                        .then((pass) => {
                            newUser.password = pass;
                            newUser.save()
                            .then((user) => res.send(_.pick(user,['name', 'phoneNumber'])))
                            .catch((err) => res.status(404).send(err.message));
                        })
                        .catch((err) => res.status(404).send(err.message));

                })
                .catch((err) => res.status(404).send(err.message));

        })
        .catch((err) => res.status(404).send(err.message));

});

router.put('/', (req, res) => {
    User.findOne({email: req.body.email})
        .then((user) => {
            bcrypt.compare(req.body.password, user.password)
                .then((bool) => {
                    if(!bool) return res.status(400).send('Unavailable username or password!');

                    user.isLoggedIn = true;
                    user.save()
                        .then((user) => {
                            const token = jwt.sign(_.pick(user, ['name', 'phoneNumber', 'email', '_id']), process.env.RENTACARKEY);
                            res.header('x-auth-token', token).send(`User ${user.name} is online!`)
                        })
                        .catch((err) => res.status(404).send(err.message));
                })
                .catch((err) => res.status(404).send(err.message));

        })
        .catch((err) => res.status(404).send(err.message));
})

router.get('/me', auth, (req, res) => {
    User.findById(req.user._id)
        .select('-password')
        .then((user)=> {
            res.status(200).send(user);
        })
        .catch((err)=> res.status(404).send(err.message));
})

module.exports = router;