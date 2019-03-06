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
 * update password
 *
 *
 * @param {string} username username
 * @param {string} password password
 * @param callback callback function(err, theUser)
 */
exports.updatePassword = function(
    username, password, callback){
  console.log("userMaintenance.js updatePassword start");
  var User = models('User');
  let theUser = { password: getHash(password)};
  console.log("Password updating: username = " + username);
  User.findOneAndUpdate({'username': username}, theUser, 
      {upsert:true, new: true},
      function(err, doc){
    callback(err, doc);
  });
}

/**
 * find a username
 *
 *
 * @param {string} username username
 * @param callback callback function(err, theUser)
 */
exports.findOne = function(username, callback){
  console.log("userMaintenance.js findOne start");
  var User = models('User');
  User.findOne({'username': username},
      function(err, theUser){
    callback(err, theUser);
  });
}

/**
 * find a username by id
 *
 *
 * @param {string} id id
 * @param callback callback function(err, theUser)
 */
exports.findOneById = function(id, callback){
  console.log("userMaintenance.js findOneById start");
  var User = models('User');
  User.findById(id,
      function(err, theUser){
    callback(err, theUser);
  });
}

/**
 * find users
 *
 *
 * @param {string} findparameters findparameters
 * @param callback callback function(err, theUser)
 */
exports.findUsers = function(findparameters, callback){
  console.log("userMaintenance.js findUsers start");
  var User = models('User');
  User.find(
    findparameters,
    function (err, docs) {
      if (err) {
        console.log('searchuser.html find error');
        next(err);
      } else {
        callback(err, docs);
      }
    }).sort({_id: -1});
}


/**
 * create a user
 *
 *
 * @param {string} username username
 * @param {string} displayname displayname
 * @param {string} password password
 * @param {boolean} admin admininistrator flag
 * @param callback callback function(err, theUser)
 */
exports.createUser = function(username, displayname, password, admin, callback){
  console.log("userMaintenance.js createUser start");
  var User = models('User');
  var aUser = new User();
  aUser.username = username;
  aUser.displayname = displayname;
  aUser.password = getHash(password);
  if (admin) {
    aUser.role = "administrator";
  } else {
    aUser.role = "";
  }
  aUser.save(function(err, user){
    callback(err, user)
  });
}

/**
 * delete a user by id
 *
 *
 * @param {string} id id
 * @param callback callback function(err, theUser)
 */
exports.deleteUserById = function(id, callback){
  console.log("userMaintenance.js deleteUserById start");
  var User = models('User');
  User.findByIdAndRemove(id,
      function(err, theUser){
    callback(err, theUser);
  });
}