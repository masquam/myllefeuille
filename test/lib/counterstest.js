var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../models');
var counters = require('../../lib/counters');

var dburi = "mongodb://localhost:27017/myllefeuilletest";

describe("counters", function() {

  before(function(done) {
    mongoose.connect(dburi, {useNewUrlParser: true});
    let db = mongoose.connection; 
    db.on('error', function (err) {return done(err)});
    db.once('open', function() { 
      let Counters = models('Counters');
      Counters.deleteMany({}, function(err){
        if (err) return done(err);
        done();
      });
    });
  });

  describe('increment()', function() {
    it('should increment the counter -first time', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() {
        counters.increment(
          dburi,
          "knowledgeCounter",
          function(err, counter){
            if (err) done(err);
            assert.strictEqual(counter["sequence"], 1);
            done();
        });
      }); 
    });
  });

  describe('increment()', function() {
    it('should increment the counter -second time', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() {
        counters.increment(
          dburi,
          "knowledgeCounter",
          function(err, counter){
            if (err) done(err);
            assert.strictEqual(counter["sequence"], 2);
            done();
        });
      });
    });
  });
});
