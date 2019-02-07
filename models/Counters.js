let mongoose = require('mongoose');

let counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, required: true }
},{
  versionKey: false
})

module.exports = mongoose.model('Counters', counterSchema);
