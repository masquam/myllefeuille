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
 * @param callback callback function(err, theKnowledge)
 */
exports.saveKnowledge = function(
    dburi, counter, version, title, content_summary, author, callback){

  console.log("saveKnowledge.js saveKnowledge start");
  mongoose.connect(dburi, {useNewUrlParser: true});
  var db = mongoose.connection; 
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() { 
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
    console.log("Knowledge saving: id=" + theKnowledge.id);
    theKnowledge.save(function(err){
      callback(err, theKnowledge);
    });
  }); 
}
