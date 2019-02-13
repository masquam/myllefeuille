let mongoose = require('mongoose');

let knowledgeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  id: Number,
  version: Number,
  current: Boolean,
  title: String,
  content_summary: String,
  author: String,
  timestamp: { type: Date, default: Date.now },
  accesscount: Number,
  like: Number
})

module.exports = mongoose.model('Knowledge', knowledgeSchema);
