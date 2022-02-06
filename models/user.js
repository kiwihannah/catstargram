const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_pw: {
    type: String,
    required: true,
    unique: false,
  },
  reg_date: {
    type: String,
    required: true,
    unique: false,
  },
});

module.exports = mongoose.model('User', userSchema);
