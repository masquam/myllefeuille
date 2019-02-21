var mongoose = require('mongoose');
var models = require('../models');

/**
 * increment the counter
 *
 *
 * @param {string} dburi mongodb uri
 * @param {string} counterType type of token
 * @param callback callback function(err, counter)
 */
exports.increment = function(dburi, counterType, callback){
  console.log("counters.js increment start");
  mongoose.connect(dburi, {useNewUrlParser: true});
  var db = mongoose.connection; 
  db.on('error', function(err){
    callback(err, null);
  });
  db.once('open', function() { 
    var Counters = models('Counters');
    var query = {_id: counterType};
    var update = {$inc: {sequence: 1}};
    var options = {upsert: true, new: true};
    Counters.findOneAndUpdate(query, update, options, function(err, counter)
    {
      callback(err, counter);
    });
  }); 
}
