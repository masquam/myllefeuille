var mongoose = require('mongoose');
var models = require('../models');
var crypto = require("crypto");
var secretKey = "qw/lQwTSpbW#IW=R3+Ke";
var getHash = function(target){
        var sha = crypto.createHmac("sha256", secretKey);
            sha.update(target);
                return sha.digest("hex");
};

/**
 * update knowledge
 *
 *
 * @param {string} username username
 * @param {string} password password
 * @param callback callback function(err, theUser)
 */
exports.updatePassword = function(
    username, password, callback){
  console.log("users.js updatePassword start");
  var User = models('User');
  let theUser = { password: getHash(password)};
  console.log("Password updating: username = " + username);
  User.findOneAndUpdate({'username': username}, theUser, 
      {upsert:true, new: true},
      function(err, doc){
    callback(err, doc);
  });
}
