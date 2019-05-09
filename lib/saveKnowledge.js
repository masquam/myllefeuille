var mongoose = require('mongoose');
var models = require('../models');

/**
 * save knowledge
 *
 *
 * @param {string} dburi mongodb uri
 * @param {number} counter counter value
 * @param {number} version version of knowledge
 * @param {string} title
 * @param {string} content_summary
 * @param {string} author
 * @param {string} imgdir
 * @param callback callback function(err, theKnowledge)
 */
exports.saveKnowledge = function(
    dburi, counter, version, title, content_summary, author, imgdir, callback){
  console.log("saveKnowledge.js saveKnowledge start");
  var Knowledge = models('Knowledge');
  var theKnowledge = new Knowledge();
  theKnowledge._id = mongoose.Types.ObjectId();
  theKnowledge.id = counter;
  theKnowledge.version = version;
  theKnowledge.current = true;
  theKnowledge.title = title;
  theKnowledge.content_summary = content_summary;
  theKnowledge.author = author;
  theKnowledge.accesscount = 0;
  theKnowledge.like = 0;
  theKnowledge.imgdir = imgdir;
  console.log("Knowledge saving: id=" + theKnowledge.id);
  theKnowledge.save(function(err){
    callback(err, theKnowledge);
  });
}

/**
 * save knowledge content
 *
 *
 * @param {string} dburi mongodb uri
 * @param {string} _id MongoDB objid
 * @param {number} id id number
 * @param {number} version version of knowledge
 * @param {string} content content
 * @param callback callback function(err, theKnowledgeContent)
 */
exports.saveKnowledgeContent = function(
    dburi, _id, id, version, content, callback){
  console.log("saveKnowledge.js saveKnowledgeContent start");
  var KnowledgeContents = models('KnowledgeContents');
  var theKnowledgeContent = new KnowledgeContents();
  theKnowledgeContent._id = _id;
  theKnowledgeContent.id = id;
  theKnowledgeContent.version = version;
  theKnowledgeContent.content = content;
  console.log("KnowledgeContent saving: id=" + id);
  theKnowledgeContent.save(function(err){
    callback(err, theKnowledgeContent);
  });
}

/**
 * save knowledge FTS
 *
 *
 * @param {string} dburi mongodb uri
 * @param {string} id id N-gram string
 * @param {string} title title N-gram string
 * @param {string} content content N-gram string
 * @param {string} author author N-gram string
 * @param callback callback function(err)
 */
exports.saveKnowledgeFTS = function(
    dburi, id, title, content, author, callback){
  console.log("saveKnowledge.js saveKnowledgeFTS start");
  var KnowledgeFTS = models('KnowledgeFTS');
  var theKnowledgeFTS = new KnowledgeFTS();
  theKnowledgeFTS.id = id;
  theKnowledgeFTS.title = title;
  theKnowledgeFTS.content = content;
  theKnowledgeFTS.author = author;
  console.log("KnowledgeFTS saving: id=" + id);
  theKnowledgeFTS.save(function(err){
    callback(err);
  });
}
