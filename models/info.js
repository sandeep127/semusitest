var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var InfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
    trim:true
  },
  
});


var Info = mongoose.model('Info', InfoSchema);
module.exports = Info;

