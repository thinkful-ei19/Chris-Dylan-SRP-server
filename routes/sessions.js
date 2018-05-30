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

// Tester function to build a single deck with all questions in database
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

    console.log(req.body)
    let name;
    Question.findByIdAndRemove(questionId)
    .then(() => {
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
            while (currNode.value._id !== questionId || currNode.value.__id !== questionId || currNode.next !== null) {
                console.log(currNode)
                count ++
                if (String(currNode.value._id) === String(questionId) || String(currNode.value.__id) === String(questionId)) {
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
            // if (found === false) {
            //     res.json(`Unable to find and delete item.`)            
            // } else {
            //     res.json(`Deleted ${questionId} from ${deckId}`)
            // }
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

    console.log('add')

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
                while (currNode.value._id !== questionId || currNode.value.__id !== questionId || currNode.next !== null) {
                    count ++
                    if (String(currNode.value._id) === String(questionId) || String(currNode.value._id) === String(questionId)) {
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
                    console.log(updateItem.linkedList)
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

//Main driver for sessions.
router.post('/update-session/:id', (req, res, next) => {
    const { id } = req.params;
    const { correct } = req.body;

    //Algorithm
    //1. Ensure that the LL is valid, initiate variables for current node, previous node, count and loop status
    //  (count is to prevent consistent front-loading of the same question, and loop status is used to determine what to do with a value to be put at the end)
    //2. Iterate through the LL, if the node to be reinserted is to be reinserted at the beginning, instead reinsert it 3 nodes away.
    //3. Otherwise, insert the node before the first node where the memoryValue is higher.
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

module.exports = router;