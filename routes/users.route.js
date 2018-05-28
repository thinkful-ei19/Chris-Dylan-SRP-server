const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')

router.get('/users', (req, res, next) => {
    User.find()
    .then((results) => {
        res.json(results)
    })
    .catch((err) => {
        console.error(err);
    })
})

router.post('/users', (req, res, next) => {
    const { username, password } = req.body;

    User.find()
        .then((results) => {
            let check = false;
            results.forEach((user) => {
                if (user.username === username) {
                    check = true;
                }
            })
            if (check === true) {
                const err = new Error('That username already exists!');
                err.status = 400;
                return next(err);
            } else {

                return User.hashPassword(password)
                    .then(digest => {
                        const newUser = {
                            username: username,
                            password: digest
                        }
                        User.create(newUser)
                            .then((result) => {
                                console.log(newUser);
                                res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
                            })
                            .catch((err) => next(err));
                    })
            }
        })
})


module.exports = router;