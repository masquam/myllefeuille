let mongoose = require('mongoose');

let saveTokenSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  tokenType: { type: String, required: true }
},{
  versionKey: false
})

module.exports = mongoose.model('saveToken', saveTokenSchema);
