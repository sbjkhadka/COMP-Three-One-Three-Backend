// This is how a user looks like to the DB
const mongoose = require('mongoose');

const user = new mongoose.Schema({
  email: {
  type: String,
  required: true,
  match: /.+\@.+\..+/,
  unique: true
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  role: {
      type: String,
      enum: ['admin','pseudo_admin','user'] // Can only accept these values from front end 
  },
  password: {
      type: String,
      required: true
  }
});

module.exports = User = mongoose.model('user', user);