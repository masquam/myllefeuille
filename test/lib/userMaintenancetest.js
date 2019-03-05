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

var test_id = "";

describe("userMaintenance", function() {
  this.timeout(10000);
  before(function(done) {
    mongoose.connect(dburi, {useNewUrlParser: true});
    let db = mongoose.connection; 
    db.on('error', function (err) {return done(err)});
    db.once('open', function() { 
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
  testUser.displayname = "test user";
  testUser.password = getHash("Ab$de123");
  testUser.role = "administrator";
  testUser.save(function(err, user){
    if (err) return done(err);
    test_id = user._id;
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

  describe('findOne()', function() {
    it('should find without error', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        userMaintenance.findOne(
          "testuser",
          function(err, theUser){
            if (err) {
              assert.fail();
            }
            assert.notStrictEqual(theUser, null);
            assert.strictEqual(theUser.username, "testuser");
            done();
        });
      });
    });
  });

  describe('findOne()', function() {
    it('should not find', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        userMaintenance.findOne(
          "testuse",
          function(err, theUser){
            if (err) {
              assert.fail();
            }
            assert.strictEqual(theUser, null);
            done();
        });
      });
    });
  }); 

  describe('findOneById()', function() {
    it('should find without error', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        console.log("id = " + test_id);
        userMaintenance.findOneById(
          test_id,
          function(err, theUser){
            if (err) {
              assert.fail();
            }
            assert.notStrictEqual(theUser, null);
            assert.strictEqual(theUser.username, "testuser");
            done();
        });
      });
    });
  });

  describe('findOneById()', function() {
    it('should not find', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        userMaintenance.findOneById(
          "dummy",
          function(err, theUser){
            if (err) {
              assert.strictEqual(theUser, undefined);
              done();
            } else {
              assert.fail();
            }
        });
      });
    });
  });

  describe('createUser()', function() {
    it('should create without error', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        userMaintenance.createUser(
          "testuser2",
          "test user 2",
          getHash("Ab$de123"),
          true,
          function(err, theUser){
            if (err) {
              assert.fail();
            }
            assert.notStrictEqual(theUser, null);
            assert.strictEqual(theUser.username, "testuser2");
            done();
        });
      });
    });
  });

  describe('createUser()', function() {
    it('should not create duplicate user', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        userMaintenance.createUser(
          "testuser",
          "test user duplicate",
          getHash("Ab$de123"),
          true,
          function(err, theUser){
            if (err) {
              assert.ok(true);
              done();
            } else {
              assert.fail();
            }
       });
      });
    });
  });

});
