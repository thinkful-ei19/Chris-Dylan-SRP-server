const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')
const Deck = require('../models/deck')
const Question = require('../models/question');
const LinkedList = require('../linkedList');

class _Node {
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
}

router.post('/new', (req, res, next) => {

    let deck = new LinkedList();

    Question.find()
    .then((result) => {
        result.forEach((item) => {
            deck.insertFirst(item)
        })
        return deck
    })
    .then((result) => {
        let newDeck = {
            name: 'French',
            linkedList: deck
        }
        Deck.create(newDeck)
        res.json('Deck Created')
    })
    .catch((err) => {
        next(err)
    })
})

router.put('/new/:id', (req, res, next) => {
    //CONTINUE FROM HERE, MAKE THE DECKS BUILD PROPERLY WITH THEIR RESPECTIVE DECKID
    const { id } = req.params;
    let deck = new LinkedList();

    Question.find()
        .then((result) => {
            result.forEach((item) => {
                console.log(item)
                if (item.deck === id) {
                    deck.insertFirst(item)
                }
            })
            const updateItem = {
                linkedList: deck.head
            }
            console.log(updateItem)
        })
        .catch(err => next(err))

})

router.get('/current/:id', (req, res, next) => {
    const { id } = req.params;
    console.log(id)

    Deck.findById(id)
    .then((result) => {
        const value = result.linkedList.head.value;
        res.json(value)
    })
    .catch((err) => {
        next(err)
    })
})

router.post('/current/:id', (req, res, next) => {
    const { id } = req.params;
    const { correct } = req.body;

    function handleSubmit(LL, reinsert, number) {

        let insert = reinsert;

        if (!LL.head) {
            return null;
        }
        if (number === 0) {
            LL.insertFirst(newItem)
            return
        } else {
            let currNode = LL.head;
            let previousNode = LL.head;
            let loopComplete = false;
            let count = 0;
            while (currNode !== null) {
                count ++
                previousNode = currNode; //count -1
                currNode = currNode.next; //count -0
                if (currNode.value.memoryValue >= number+1) {
                    if (count === 1) {
                        //If the card is going to be relegated back to the start, just push it back a few spots instead.
                        previousNode = currNode.next;
                        currNode = currNode.next.next;
                        let placeholder = reinsert;
                        LL.head = LL.head.next;                   
                        placeholder.next = currNode;
                        previousNode.next = placeholder;
                    } else {
                        let placeholder = reinsert;
                        LL.head = LL.head.next;                   
                        placeholder.next = currNode;
                        previousNode.next = placeholder;
                    }
                    break           
                } else if (currNode.next === null) {    
                    loopComplete = true;
                    break
                }
            }        
            if (loopComplete === true) {
                let placeholder = reinsert;
                LL.head = LL.head.next;
                placeholder.next = null;
                currNode.next = placeholder
                return LL;                
            }
        }
        return LL;
    }

    Deck.findById(id)
    .then((result) => {
        item = result.linkedList
        if (correct === false) {
            item.head.value.memoryValue = 1;
        } else {
            item.head.value.memoryValue = item.head.value.memoryValue * 2;
        }
        console.log(item.head)
        let reinsert = item.head;
        handleSubmit(item, reinsert, reinsert.value.memoryValue)
        return item;
    })
    .then((result) => {
        let updateObject = {
            linkedList: result
        }
        Deck.findByIdAndUpdate(id, updateObject)
        .then((result) => {
            res.json(result.linkedList.head.next.value);
            // res.json(result)
        })
        .catch((err) => {next(err)})
    })
    .catch(err => {
        next(err);
    })

})

module.exports = router;