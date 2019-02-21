var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../models');
var handlesaveToken = require('../../lib/handlesaveToken');

var dburi = "mongodb://localhost:27017/myllefeuilletest";

var test_objid = "";

describe("handlesaveToken", function() {

  before(function(done) {
    mongoose.connect(dburi, {useNewUrlParser: true});
    let db = mongoose.connection; 
    db.on('error', function (err) {return done(err)});
    db.once('open', function() { 
      let saveToken = models('saveToken');
      saveToken.deleteMany({}, function(err){
        if (err) return done(err);
        done();
      });
    });
  });

  describe('generateAndSave()', function() {
    it('should save without error and return objid', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        handlesaveToken.generateAndSave(
          "saveKnowledge",
          function(err, objid){
            if (err) {
              done(err);
            } else {
              test_objid = objid;
              done();
            }
        });
      }); 
    });
  });

  describe('findTokenByid()', function() {
    it('should find the objid', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        handlesaveToken.findTokenByid(
          test_objid,
          function(err, objid){
            if (err) {
              done(err);
            } else {
              done();
            }
        });
      });
    });
  });

  describe('DeleteToken()', function() {
    it('should delete the objid', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        handlesaveToken.DeleteToken(
          test_objid,
          function(err, doc){
            if (err) {
              done(err);
            } else {
              done();
            }
        });
      });
    });
  });

});
