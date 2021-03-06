'use strict';

const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  name: { type: String },
  linkedList: { type: Object, default: null },
  public: { type: Boolean, default: false }
});

deckSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Deck', deckSchema);