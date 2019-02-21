var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../models');
var saveKnowledge = require('../../lib/saveKnowledge');

var dburi = "mongodb://localhost:27017/myllefeuilletest";

describe("saveKnowledge", function() {
  this.timeout(5000);
  before(function(done) {
    mongoose.connect(dburi, {useNewUrlParser: true});
    let db = mongoose.connection; 
    db.on('error', function (err) {return done(err)});
    db.once('open', function() { 
      let Knowledge = models('Knowledge');
      Knowledge.deleteMany({}, function(err){
        if (err) return done(err);
        let KnowledgeContents = models('KnowledgeContents');
        KnowledgeContents.deleteMany({}, function(err){
          if (err) return done(err);
          let KnowledgeFTS = models('KnowledgeFTS');
          KnowledgeFTS.deleteMany({}, function(err){
            if (err) return done(err);
            done();
          });
        });
      });
    });
  });

  describe('saveKnowledge()', function() {
    this.timeout(5000);
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

  describe('saveKnowledgeContent()', function() {
    this.timeout(5000);
    it('should save without error', function(done) {
      saveKnowledge.saveKnowledgeContent(
        dburi,
        mongoose.Types.ObjectId(),
        1,
        1,
        "content",
        function(err, theKnowledgeContent){
          if (err) done(err);
          done();
      });
    });
  });

  describe('saveKnowledgeFTS()', function() {
    this.timeout(5000);
    it('should save without error', function(done) {
      saveKnowledge.saveKnowledgeFTS(
        dburi,
        "1",
        "ti it tl le",
        "co on nt te en nt",
        "au ut th ho or",
        function(err){
          if (err) done(err);
          done();
      });
    });
  });

});
