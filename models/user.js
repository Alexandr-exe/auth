const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      required: true,
    },
  },
  password: {
    type: String,
    required: true,
    validate: /[A-Za-z0-9\W]+/,
    minlength: 8,
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('user', userSchema);
