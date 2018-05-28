'use strict';

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },  
  next: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  previous: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
});

questionSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Question', questionSchema);
