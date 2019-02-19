var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../models');
var saveKnowledge = require('../../lib/saveKnowledge');

var dburi = "mongodb://localhost:27017/myllefeuilletest";

describe("saveKnowledge", function() {

  before(function(done) {
    mongoose.connect(dburi, {useNewUrlParser: true});
    let db = mongoose.connection; 
    db.on('error', function (err) {return done(err)});
    db.once('open', function() { 
      let Knowledge = models('Knowledge');
      Knowledge.deleteMany({}, function(err){
        if (err) return done(err);
        done();
      });
    });
  });

  describe('saveKnowledge()', function() {
    it('should save without error', function(done) {
      saveKnowledge.saveKnowledge(
        dburi,
        1,
        1,
        "test title",
        "content summary",
        "author",
        function(err, theKnowledge){
          if (err) done(err);
          done();
      });
    });
  });

});
