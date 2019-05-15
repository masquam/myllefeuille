var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../models');
var saveKnowledge = require('../../lib/saveKnowledge');
var editKnowledge = require('../../lib/editKnowledge');

var dburi = "mongodb://localhost:27017/myllefeuilletest";

var test_id = 0;

describe("editKnowledge", function() {
  this.timeout(10000);
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
            saveTestData1(done);
          });
        });
      });
    });
  });

function saveTestData1(done){
  saveKnowledge.saveKnowledge(
    dburi,
    1,
    1,
    "test title",
    "content summary",
    "author",
    "5cd390421950e333383d9c56",
    function(err, theKnowledge){
      if (err) done(err);

      test_id = theKnowledge.id;

      saveKnowledge.saveKnowledgeContent(
        dburi,
        mongoose.Types.ObjectId(),
        1,
        1,
        "content",
        function(err, theKnowledgeContent){
          if (err) {
            done(err);
          }
          saveKnowledge.saveKnowledgeFTS(
            dburi,
            "1",
            "ti it tl le",
            "co on nt te en nt",
            "au ut th ho or",
            function(err){
            if (err) {
              done(err);
            }
            done();
          });
      });
  });
}

  describe('updateKnowledge()', function() {
    it('should update without error', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        editKnowledge.updateKnowledge(
          test_id,
          1,
          "updated test title",
          "updated content summary",
          Date.now(),
          "updated author",
          "5cd390421950e333383d9c56",
          function(err, theKnowledge){
            if (err) {
              assert.fail();
            }
            done();
        });
      });
    });
  }); 

  describe('updateKnowledgeContent()', function() {
    it('should update without error', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        editKnowledge.updateKnowledgeContent(
          test_id,
          1,
          "updated content",
          function(err, theKnowledgeContent){
            if (err) {
              done(err);
            }
            done();
        });
      });
    });
  }); 

  describe('updateKnowledgeFTS()', function() {
    it('should update without error', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 
        editKnowledge.updateKnowledgeFTS(
          test_id.toString(),
          "up pd da at te ed",
          "up pd da at te ed",
          "up pd da at te ed",
          function(err, doc){
            if (err) {
              console.log(err);
              assert.fail();
            }
            done();
        });
      });
    });
  }); 

});
