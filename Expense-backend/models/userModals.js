const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['free', 'isPrimium'],
    default: 'free',
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserSchema.virtual('expenses', {
  ref: 'Expense',
  localField: '_id',
  foreignField: 'userId'
});

module.exports = mongoose.model('User', UserSchema);
