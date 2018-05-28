const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')

router.get('/users', (req, res, next) => {
    User.find()
    .then((res) => {
        res.json(res)
    })
    .catch((err) => {
        console.error(err);
    })
})


module.exports = router;