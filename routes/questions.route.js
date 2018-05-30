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
        next(err)
    })
})

router.get('/questions/:id', (req, res, next) => {
    const { id } = req.params;

    Question.findById(id)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            next(error);
        })
})

router.post('/questions', (req, res, next) => {
    const { question, answer, deckId } = req.body;
    const newItem = { question, answer, deckId }

    Question.create(newItem)
    .then((result) => {
        res.location(`${req.originalUrl}/${result.id}`).status(201).json(result)
    })
    .catch(err => {
        next(err)
    })
    
})

router.put('/questions/:id', (req, res, next) => {
    const { question, answer, deckId } = req.body;
    const { id } = req.params;
    const updateItem = { question, answer, id, deckId };

    //Working, but response is for some reason showing the old value rather than the new.
    Question.findByIdAndUpdate(id, updateItem)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            next(error);
        })
})

router.delete('/questions/:id', (req, res, next) => {
    const { id } = req.params;

    Question.findByIdAndRemove(id)
        .then(() => {
            res.status(204).end();
        })
        .catch((err) => {
            next(err);
        })
})

module.exports = router;