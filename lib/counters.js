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
  var Counters = models('Counters');
  var query = {_id: counterType};
  var update = {$inc: {sequence: 1}};
  var options = {upsert: true, new: true};
  Counters.findOneAndUpdate(query, update, options, function(err, counter)
  {
    callback(err, counter);
  });
}
