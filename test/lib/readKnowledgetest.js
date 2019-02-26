var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../models');
var saveKnowledge = require('../../lib/saveKnowledge');
var readKnowledge = require('../../lib/readKnowledge');

var dburi = "mongodb://localhost:27017/myllefeuilletest";

describe("readKnowledge", function() {
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
            saveKnowledge.saveKnowledge(
              dburi,
              1,
              1,
              "test title",
              "content summary",
              "author",
              function(err, theKnowledge){
                if (err) done(err);
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
                        if (err) done(err);
                        done();
                    });
                });
            });
          });
        });
      });
    });
  });

  describe('read()', function() {
    it('should read without error', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 

        readKnowledge.read(
          null,
          1,
          function(err, res, id, knowledge, knowledgeContent){
            assert.strictEqual(id,1);
            done();
        });

      });
    });
  }); 



});
