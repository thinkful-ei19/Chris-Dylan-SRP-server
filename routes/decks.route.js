const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Deck = require('../models/deck');
const User = require('../models/user');

router.get('/decks', (req, res, next) => {
    Deck.find()
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        next(err)
    })
})

router.get('/decks/:id', (req, res, next) => {
    const { id } = req.params;
    Deck.findById(id)
    .then((result) => {
        console.log(result)
        res.json(result);
    })
    .catch((err) => {
        next(err)
    })
})

router.post('/decks', (req, res, next) => {
    const { name, linkedList } = req.body;
    const newItem = { name, linkedList }

    Deck.create(newItem)
    .then((result) => {
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result)
    })
    .catch(err => {
        next(err)
    })
})

router.put('/decks/:id', (req, res, next) => {
    const { name, linkedList } = req.body;
    const { id } = req.params;
    const updateItem = { name, linkedList, id };

    //Working, but response is for some reason showing the old value rather than the new.
    Deck.findByIdAndUpdate(id, updateItem)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            next(error);
        })
})

router.delete('/decks/:id', (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;
    let updateUser;
    User.findById(userId)
        .then((result) => {
            let decks = [];
            updateUser = result;
            updateUser.decks.forEach((deckId) => {
                if (String(deckId) !== id) {
                    decks.push(deckId)
                }                
            })
            updateUser.decks = decks;
            return updateUser;
        })
        .then((result) => {
            User.findByIdAndUpdate(userId, updateUser)
            return;
        })
        .catch(err => next(err))

    Deck.findByIdAndRemove(id)
        .then((result) => {
            res.status(204).end();
        })
        .catch((err) => {
            next(err)
        })
})


module.exports = router;