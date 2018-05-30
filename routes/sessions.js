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

//This endpoint builds a new deck by getting the deckIds of questions that match its own ID.
router.put('/compile-deck/:id', (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    let deck = new LinkedList();

    Question.find()
        .then((result) => {
            result.forEach((item) => {
                if (item.deckId === id) {
                    deck.insertFirst(item)
                }
            })
            let newDeck = {
                name: name,
                linkedList: deck
            }
            Deck.findByIdAndUpdate(id, newDeck)
            .then((result) => {
                console.log(result)
            });
            res.json(newDeck)
        })
        .catch(err => next(err))
})

//Handle deletion of linkedList Items
router.delete('/delete-item', (req, res, next) => {
    const { deckId, questionId } = req.body;

    let name;
    Question.findByIdAndRemove(questionId)
    .then((result) => {
        Deck.findById(deckId)
        .then((result) => {
            name = result.name
            let LL = result.linkedList;
            let previousNode = LL.head; 
            let currNode = LL.head;
            let count = 0;
            let found = false

            if (currNode.value._id === questionId) {
                found = true;
            } else if (currNode.value.__id == questionId) {
                found = true;
            }
            //MongoDB for some reason changes id to be either _id or __id. Need to fix this so that this can be refactored.            
            while (currNode.value._id !== questionId || currNode.value.__id !== questionId || currNode.next !== null) {
                count ++
                if (currNode.value._id === questionId || currNode.value.__id === questionId) {
                    found = true;
                    break
                }
                previousNode = currNode;
                currNode = currNode.next
                if (currNode.next === null) {
                    break
                }
            }
            //* With the current way the client-side is set up, it will always delete only the first item in queue. */
            if (count <= 1 && found === true) {
                LL.head = LL.head.next;
            } else if (found === true) {
                currNode = currNode.next;
                previousNode.next = currNode;
            }
            return LL;
        })
        .then((result) => {       
            let updateItem = {
                linkedList: result
            }
            Deck.findByIdAndUpdate(deckId, updateItem).then((result) => console.log(result))
            res.json(result)
        })
        .catch((err) => next(err))
        })
    .catch((err) => {
        next(err);
    })   
})

//Allow users to add items to linked list and database
router.post('/add-item', (req,res, next) => {
    const { question, answer, deckId } = req.body;
    const newItem = { question, answer, deckId }

    Question.create(newItem)
    .then((result) => {
        const newHeadValue = result;
        Deck.findById(deckId)
            .then((result) => {
                let LL = result.linkedList; //Grab LL
                LL.head = new _Node(newHeadValue, LL.head);
                return LL;
            })
            .then((result) => { 
                let updateItem = {
                    linkedList: result
                }
                Deck.findByIdAndUpdate(deckId, updateItem).then((result) => console.log(result))
                res.json(`Added question ${question} to list and database`)     
            })
            .catch(err => next(err))
    })
    .catch(err => {
        next(err)
    })

})

//Allows user to edit items in the linked list and database simultaneously.
router.put('/edit-item', (req, res, next) => {

    const { deckId, questionId, question, answer } = req.body;

    const updateItem = { question, answer, deckId };

    Question.findByIdAndUpdate(questionId, updateItem)
        .then((result) => {
            Deck.findById(deckId)
            .then((result) => {
                let LL = result.linkedList;
                let currNode = LL.head;
                let count = 0;
                let found = false;
                if (currNode.value._id === questionId || currNode.value.__id == questionId) {
                    currNode.value.question = question;
                    currNode.value.answer = answer;
                    return LL;     
                }
                //MongoDB for some reason changes id to be either _id or __id. Need to fix this so that this can be refactored.
                while (currNode.value._id !== questionId || currNode.value.__id !== questionId || currNode.next !== null) {
                    count ++
                    if (currNode.value._id === questionId || currNode.value._id === questionId) {
                        found = true;
                        break
                    }
                    currNode = currNode.next
                    if (currNode.next === null) {
                        break
                    }
                }
                if (found === true) {
                    currNode.value.question = question;
                    currNode.value.answer = answer;
                    return LL;                    
                } else {
                    return false
                }
            })
            .then((result) => { 
                if (result === false) {
                    res.json('Unable to find item')
                } else {
                    let updateItem = {
                        linkedList: result
                    }
                    Deck.findByIdAndUpdate(deckId, updateItem).then((result) => console.log(result))
                    res.json(`Updated question of id: ${questionId} from list and database`)     
                }
            })
            .catch((err) => next(err))
        })
        .catch((error) => {
            next(error);
        })
})


//Start sessions by getting the first question in a linkedList.
router.get('/start-session/:id', (req, res, next) => {
    const { id } = req.params;

    Deck.findById(id)
    .then((result) => {
        const value = result.linkedList.head.value;
        res.json(value)
    })
    .catch((err) => {
        next(err)
    })
})

//Main driver for sessions.
router.post('/update-session/:id', (req, res, next) => {
    const { id } = req.params;
    const { correct } = req.body;

    //Algorithm
    //1. Ensure that the LL is valid
    //2a. Iterate through the LL, if the node to be reinserted is to be reinserted at the beginning, insert it one after instead.
    //2b. Otherwise, insert the node before the first node where the memoryValue is higher.
    //2c. If the while loop gets to point where the next value is null, reinsert at that point.
    //3. Set the new head of the LL to be the next value when doing the swaps.
    function handleSubmit(LL, reinsert, number) {
        if (!LL.head) {
            return null;
        }

        //If 2nd LL value has higher M value;
        if (LL.head.next.value.memoryValue > number) {
            //Insert after first.
            let origHead = LL.head;
            LL.head = LL.head.next;
            origHead.next = LL.head.next;
            LL.head.next = origHead;
            return LL
        }

        let currNode = LL.head;
        let previousNode = LL.head; 
        while (currNode.next !== null) {
            previousNode = currNode;
            currNode = currNode.next;
            if (currNode.value.memoryValue > number) {
                //Insert inbetween
                previousNode.next = reinsert;
                LL.head = LL.head.next;
                reinsert.next = currNode;
                break
            }
            if (currNode.next === null) {
                //Insert at end
                currNode.next = reinsert;
                LL.head = LL.head.next;                
                reinsert.next = null;                
                break;
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
            if (result.linkedList.head.next !== null) {
                res.json(result.linkedList.head.next.value);
            } else {
                res.json(result.linkedList.head.value)
            }
        })
        .catch((err) => {next(err)})
    })
    .catch(err => {
        next(err);
    })

})

router.get('/get-count/:id', (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
    .then(result => {
        res.json({totalCorrect: result.totalCorrect})
    })
    .catch((err) => next(err));
})

router.put('/increment-count/:id', (req, res, next) => {
    const { id } = req.params;

    let updateItem;

    User.findById(id)
    .then(result => {
        updateItem = result;
        updateItem.totalCorrect = updateItem.totalCorrect + 1;
        User.findByIdAndUpdate(id, updateItem)
        .then((result) => {
            res.json(result)
        })
        .catch((err) => next(err))
    })
    .catch((err) => next(err));
})

router.get('/deck-list/:id', (req, res, next) => {
    const { id } = req.params;

    let decks = []

    User.findById(id)
    .then((result) => {
        result.decks.forEach((deck) => {
            Deck.findById(deck)
            .then((result) => {
                deck = {
                    name: result.name,
                    id: result.id
                }
                decks.push(deck)
                return decks
            })
        })
        setTimeout(function() {res.json({decks})}, 1000)
        return ({decks})
    })
    .catch((err) => next(err))
})

module.exports = router;