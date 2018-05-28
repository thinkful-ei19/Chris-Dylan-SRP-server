const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Question = require('../models/question')

router.get('/questions', (req, res, next) => {
    Question.find()
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        console.error(err)
    })
})

router.post('/questions', (req, res, next) => {
    const { question, answer } = req.body;
    const newItem = { question, answer }

    Question.create(newItem)
    .then((result) => {
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result)
    })
    .catch(err => {
        next(err)
    })
})

module.exports = router;