const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')
const Deck = require('../models/deck');
const LinkedList = require('../linkedList');
const sample = require('../sampleData/sampleData');

let demoLL = new LinkedList();
sample.forEach((item) => {
    demoLL.insertFirst(item)
})

function display(LL) {
    let currNode = LL.head;
    console.log(currNode)
    while (currNode.next !== null) {
        console.log(currNode)
        currNode = currNode.next
    }
}

router.get('/users', (req, res, next) => {
    User.find()
    .populate('decks')
    .then((results) => {
        res.json(results)
    })
    .catch((err) => {
        next(err);
    })
})

router.get('/users/:id', (req, res, next) => {
    const { id } = req.params;
    
    User.findById(id)
    .populate('decks')    
    .then((result) => {
        res.json(result)
    })
    .catch((err) => {
        next(err)
    })
})

router.post('/users', (req, res, next) => {
    const { username, password } = req.body;

    const newDeck = {
        name: 'French',
        linkedList: demoLL
    }

    let deckId;

    Deck.create(newDeck)
        .then((result) => {
            deckId = result.id
            console.log(deckId)
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
                                password: digest,
                                decks: [deckId]
                            }
                            User.create(newUser)
                                .then((result) => {
                                    // console.log(newUser);
                                    res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
                                })
                                .catch((err) => next(err));
                        })
                }
            })
            .catch(err => next(err))
        })
})

router.put('/users/:id', (req, res, next) => {
    const { id } = req.params;
    const { username, password, decks } = req.body;
    const options = { new: true }

    let newUser = {
        username: username,
        password: password,
        decks: decks
    }

    User.findByIdAndUpdate(id, newUser, options)
        .then((result) => {
            if (result) {
                res.json(result);
            }
        })
        .catch((error) => {
            next(error);
        })
})

// router.put('/password/:id', (req, res, next) => {
//     const { id } = req.params;
//     const { username, password, data, goal } = req.body;
//     const options = { new: true }

//     return User.hashPassword(password)
//     .then(digest => {
//         const newUser = {
//             data: data,
//             goal: "Maintain",
//             username: username,
//             password: digest
//         }
//         User.findByIdAndUpdate(id, newUser, options)
//             .populate('data')
//             //Deep populate measurements
//             .populate({
//                 path: 'data',
//                 populate: { path: 'measurements'}
//             })
//             .then((result) => {
//                 if (result) {
//                     console.log(result);
//                     res.json(result);
//                 }
//             })
//             .catch((error) => {
//                 next(error);
//             })
//     })
// });

router.delete('/users/:id', (req, res, next) => {
    const { id } = req.params;

    User.findByIdAndRemove(id)
        .then(() => {
            res.status(204).end();
        })
        .catch((error) => {
            next(error);
        })
})


module.exports = router;