class _Node {
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null
    }

    insertFirst(item) {
        this.head = new _Node(item, this.head);
    }

    // insertLast(item) {
    //     if (this.head === null) {
    //         this.insertFirst(item);
    //     } else {
    //         let tempNode = this.head;
    //         while (tempNode.next !== null) {
    //             tempNode = tempNode.next;
    //         }
    //         tempNode.next = new _Node(item, null)
    //     }
    // }

    // find(item) {
    //     let currNode = this.head;
    //     if (!this.head) {
    //         return null;
    //     }
    //     while (currNode.value !== item) {
    //         if (currNode.next === null) {
    //             return null;
    //         }
    //         else {
    //             currNode = currNode.next;
    //         }
    //     }
    //     return currNode;
    // }

    // remove(item) {
    //     if (!this.head) {
    //         return null;
    //     }
    //     if (this.head.value === item) {
    //         this.head = this.head.next;
    //         return;
    //     }
    //     let currNode = this.head;
    //     let previousNode = this.head;

    //     while ((currNode !== null) && (currNode.value !== item)) {
    //         previousNode = currNode;
    //         currNode = currNode.next;
    //     }
    //     if (currNode === null) {
    //         console.log('Item not found');
    //         return;
    //     }
    //     previousNode.next = currNode.next;
    // }

    // insertBefore(newItem, before) {

    //     if (!this.head) {
    //         return null;
    //     }

    //     if (this.head.value === before) {
    //         this.insertFirst(newItem)
    //         return
    //     }   else {
    //         let currNode = this.head;       //A
    //         let previousNode = this.head;   //B
    //         //Iterate through the LL
    //         while ((currNode !== null) && (currNode.value !== before)) {
    //             previousNode = currNode;
    //             currNode = currNode.next;
    //         } //If B is === to beforeItem

    //         if (currNode.value === before) { //<=== this is not necessary
    //             //Make a new node, with the new node's next referencing currNode, and the previous Node's next referencing the new node.
    //             previousNode.next = new _Node(newItem, currNode)

                
    //         } else if (currNode === null) {
    //             console.log('Item for new item to be inserted before not found.')
    //             return;
    //         }
    //     }
    // }

    // insertAfter(newItem, after) {
    //     //This method is behaving incredibly weird, if I don't declare this insert variable is claims newItem is undefined.
    //     let insert = newItem
    //     if (!this.head) {
    //         return null;
    //     }
    //     if (this.head.value === after) {
    //         let previousNode = this.head;
    //         let nextNode = previousNode.next
    //         previousNode.next = new _Node(insert, nextNode)
    //     } else {
    //         let currNode = this.head;
    //         let previousNode = this.head;
    //         while ((currNode !== null) && (currNode.value !== after)) {
    //             previousNode = currNode;
    //             currNode = currNode.next;
    //         } //If B is === to afterItem
    //         if (currNode.value === after) {
    //             //Shift it up once more, the current node becomes the previous node, and the next node becomes current node so that we can pass it as the next node for new Node.
    //             previousNode = currNode;
    //             currNode = currNode.next;
    //             previousNode.next = new _Node(insert, currNode)
    //         } else if (currNode === null) {
    //             console.log('Item for new item to be inserted after not found.')
    //             return;
    //         }
    //     }
    // }

    // insertAt(newItem, number) {
    //     let count = 0;
    //     let insert = newItem
    //     if (!this.head) {
    //         return null;
    //     }
    //     if (number === 0) {
    //         this.insertFirst(newItem)
    //         return
    //     } else {
    //         let currNode = this.head;
    //         let previousNode = this.head;
    //         while ((currNode !== null) && (count <= number)) {
    //             count = count + 1
    //             previousNode = currNode; //count -1
    //             currNode = currNode.next; //count -0
    //             if (count === number) {
    //                 previousNode.next = new _Node(insert, currNode)
    //             } else if (currNode === null) {
    //                 console.log('Count has exceeded the amount of items, unable to insert.')
    //                 return;
    //             }
    //         }
    //     }
    // }

    // insertBeforeMV(reinsert, number) {
    //     let insert = reinsert;
        
    //     if (!this.head) {
    //         return null;
    //     }
    //     if (number === 0) {
    //         this.insertFirst(newItem)
    //         return
    //     } else {
    //         let currNode = this.head;
    //         let previousNode = this.head;
    //         while ((currNode !== null)) {
    //             previousNode = currNode; //count -1
    //             currNode = currNode.next; //count -0
    //             if (currNode.value.memoryValue === number+1) {
    //                 previousNode.next = new _Node(insert, currNode)
    //             } else if (currNode === null) {
    //                 console.log('Count has exceeded the amount of items, unable to insert.')
    //                 return;
    //             }
    //         }
    //     }
    // }
}

module.exports = LinkedList;