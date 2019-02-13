let mongoose = require('mongoose');

let knowledgeFTSSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  author: String,
})

knowledgeFTSSchema.index({ id: 'text', title: 'text', content: 'text', author: 'text' });

module.exports = mongoose.model('KnowledgeFTS', knowledgeFTSSchema);
