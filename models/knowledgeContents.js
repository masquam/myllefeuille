let mongoose = require('mongoose');

let knowledgeContentsSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  id: Number,
  version: Number,
  content: String,
})

module.exports = mongoose.model('KnowledgeContents', knowledgeContentsSchema);
