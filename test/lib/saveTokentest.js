var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../models');
var saveToken = require('../../lib/saveToken');

var dburi = "mongodb://localhost:27017/myllefeuilletest";

describe("saveToken", function() {

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
      saveToken.generateAndSave(
        dburi,
        "saveKnowledge",
        function(err, objid){
          if (err) done(err);
          else done();
      });
    });
  });

});
