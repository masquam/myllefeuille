var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../models');
var userMaintenance = require('../../lib/userMaintenance');
var crypto = require("crypto");
var secretKey = "qw/lQwTSpbW#IW=R3+Ke";
var getHash = function(target){
        var sha = crypto.createHmac("sha256", secretKey);
            sha.update(target);
                return sha.digest("hex");
};

var dburi = "mongodb://localhost:27017/myllefeuilletest";

var test_id = 0;

describe("userMaintenance", function() {
  this.timeout(10000);
  before(function(done) {
    mongoose.connect(dburi, {useNewUrlParser: true});
    let db = mongoose.connection; 
    db.on('error', function (err) {return done(err)});
    db.once('open', function() { 
/*
      var authSchema = mongoose.Schema({ 
        username: 'string',
        password: 'string',
        role: 'string'
      });
      authSchema.methods.validPassword = function( pwd ) {
        return ( this.password === getHash(pwd) );
      };
      var Users = mongoose.model('users', authSchema);
*/
  var User = models('User');
      User.deleteMany({}, function(err){
        if (err) return done(err);
        saveTestData1(done, User);
      });
    });
  });

function saveTestData1(done, User){
  console.log("start creating the user...");
  var testUser = new User();
  testUser.username = "testuser";
  testUser.password = getHash("password");
  testUser.role = "administrator";
  testUser.save(function(err, user){
    if (err) return done(err); 
    done();
  });
}

  describe('updatePassword()', function() {
    it('should update without error', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        userMaintenance.updatePassword(
          "testuser",
          "hoge",
          function(err, theUser){
            if (err) {
              assert.fail();
            }
            done();
        });
      });
    });
  }); 

});
