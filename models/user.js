const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    decks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deck' }],
    totalCorrect: { type: Number, default: 0}
})

userSchema.set('toObject', {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    }
});

userSchema.methods.validatePassword = function (password) {
    // console.log('passwords are: ', password, this.password)
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);