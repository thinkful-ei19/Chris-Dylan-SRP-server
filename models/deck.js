'use strict';

const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  name: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

deckSchema.index({ name: 1, userId: 1 }, {unique: true});

deckSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Deck', deckSchema);
