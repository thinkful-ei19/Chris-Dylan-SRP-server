const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck')

router.get('/decks', (req, res, next) => {
    Deck.find()
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        console.error(err)
    })
})

router.post('/decks', (req, res, next) => {
    const { name, head } = req.body;
    const newItem = { name, head }

    Deck.create(newItem)
    .then((result) => {
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result)
    })
    .catch(err => {
        next(err)
    })
})

module.exports = router;