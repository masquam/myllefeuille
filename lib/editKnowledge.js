var mongoose = require('mongoose');
var models = require('../models');

/**
 * update knowledge
 *
 *
 * @param {string} _id MongoDB objid
 * @param {number} id id value
 * @param {number} version version of knowledge
 * @param {string} title
 * @param {string} content_summary
 * @param {string} author
 * @param callback callback function(err, theKnowledge)
 */
exports.updateKnowledge = function(
    id, version, title, content_summary, timestamp, author, imgdir, callback){
  console.log("editKnowledge.js updateKnowledge start");
  var Knowledge = models('Knowledge');
  let theKnowledge = 
    { id: id, version: version, current: true, title: title,
      content_summary: content_summary, timestamp: timestamp,
      author: author, imgdir: imgdir};
  console.log("Knowledge updating: id=" + theKnowledge.id);
  Knowledge.findOneAndUpdate({'id': id}, theKnowledge, 
      {upsert:true, new: true},
      function(err, doc){
    callback(err, doc);
  });
}

/**
 * update knowledge content
 *
 *
 * @param {number} id id number
 * @param {number} version version of knowledge
 * @param {string} content content
 * @param callback callback function(err, theKnowledgeContent)
 */
exports.updateKnowledgeContent = function(
    id, version, content, callback){
  console.log("editKnowledge.js updateKnowledgeContent start");
  var KnowledgeContents = models('KnowledgeContents');
  let theKnowledgeContent = {id: id, version: version, content: content};
  console.log("KnowledgeContent updating: id=" + id);
  KnowledgeContents.findOneAndUpdate({'id': id}, theKnowledgeContent, 
      {upsert:true, new: true},
      function(err, doc){
    callback(err, doc);
  });
}

/**
 * update knowledge FTS
 *
 *
 * @param {string} id id N-gram string
 * @param {string} title title N-gram string
 * @param {string} content content N-gram string
 * @param {string} author author N-gram string
 * @param callback callback function(err, doc)
 */
exports.updateKnowledgeFTS = function(
    id, title, content, author, callback){
  console.log("editKnowledge.js updateKnowledgeFTS start");
  var KnowledgeFTS = models('KnowledgeFTS');
  let theKnowledgeFTS = 
    { id: id, title: title, content: content, author: author};
  console.log("KnowledgeFTS updating: id=" + id);
  KnowledgeFTS.findOneAndUpdate(
      {'id': id},
      theKnowledgeFTS, 
      {upsert:true, new: true},
      function(err, doc){
    callback(err, doc);
  });
}
