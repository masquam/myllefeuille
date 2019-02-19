var mongoose = require('mongoose');
var models = require('../models');

/**
 * generate and save saveToken objid
 *
 *
 * @param {string} dburi mongodb uri
 * @param {string} tokenType type of token
 * @param callback callback function(err, objid)
 */
exports.generateAndSave = function(dburi, tokenType, callback){
  console.log("saveToken.js generateAndSave start");
  var objid = mongoose.Types.ObjectId();
  mongoose.connect(dburi, {useNewUrlParser: true});
  var db = mongoose.connection; 
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() { 
    var saveToken = models('saveToken');
    var theToken = new saveToken();
    theToken._id = objid;
    theToken.tokenType = tokenType;
    theToken.save(function(err){
      console.log("saveToken.js generateAndSave completed.");
      callback(err, objid);
    });
  }); 
}

