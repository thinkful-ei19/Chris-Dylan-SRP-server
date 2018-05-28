'use strict';

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String },
  answer: { type: String },  
  deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true }
});

questionSchema.index({ name: 1, userId: 1 }, {unique: true});

questionSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Question', questionSchema);
