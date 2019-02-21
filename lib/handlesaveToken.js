var mongoose = require('mongoose');
var models = require('../models');

/**
 * generate and save saveToken objid
 *
 *
 * @param {string} tokenType type of token
 * @param callback callback function(err, objid)
 */
exports.generateAndSave = function(tokenType, callback){
  console.log("handlesaveToken.js generateAndSave start");
  var objid = mongoose.Types.ObjectId();
  var saveToken = models('saveToken');
  var theToken = new saveToken();
  theToken._id = objid;
  theToken.tokenType = tokenType;
  theToken.save(function(err){
    console.log("saveToken.js generateAndSave completed.");
    callback(err, objid);
  });
}

/**
 * find saveToken by objid
 *
 *
 * @param {string} savetoken_id savetoken_id
 * @param callback callback function(err, savetoken)
 */
exports.findTokenByid = function(savetoken_id, callback){
  console.log("handlesaveToken.js findByid start");
  var saveToken = models('saveToken');
  var theToken = new saveToken();
  saveToken.findById(savetoken_id, function (err, savetoken) {
    callback(err, savetoken);
  });
}

/**
 * delete saveToken by objid
 *
 *
 * @param {string} savetoken_id savetoken_id
 * @param callback callback function(err, doc)
 */
exports.DeleteToken = function(savetoken_id, callback){
  console.log("handlesaveToken.js findByid start");
  var saveToken = models('saveToken');
  var theToken = new saveToken();
  saveToken.findOneAndDelete({_id: savetoken_id},function (err, doc) {
    callback(err, doc);
  });
}
