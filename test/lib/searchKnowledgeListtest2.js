var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../models');
var saveKnowledge = require('../../lib/saveKnowledge');
var searchKnowledgeList = require('../../lib/searchKnowledgeList');

var dburi = "mongodb://localhost:27017/myllefeuilletest";

describe("searchKnowledgeList", function() {
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
              saveTestData2(done);
          });
      });
  });
}

function saveTestData2(done){
  saveKnowledge.saveKnowledge(
    dburi,
    2,
    1,
    "test title",
    "content summary",
    "author",
    function(err, theKnowledge){
      if (err) done(err);
      saveKnowledge.saveKnowledgeContent(
        dburi,
        mongoose.Types.ObjectId(),
        2,
        1,
        "content",
        function(err, theKnowledgeContent){
          if (err) {
            done(err);
          }
          saveKnowledge.saveKnowledgeFTS(
            dburi,
            "2",
            "ti it tl le",
            "co on nt te en nt",
            "au ut th ho or",
            function(err){
              if (err) done(err);
              saveTestData3(done);
          });
      });
  });
}

function saveTestData3(done){
  saveKnowledge.saveKnowledge(
    dburi,
    3,
    1,
    "test title",
    "content summary",
    "author",
    function(err, theKnowledge){
      if (err) done(err);
      saveKnowledge.saveKnowledgeContent(
        dburi,
        mongoose.Types.ObjectId(),
        3,
        1,
        "content",
        function(err, theKnowledgeContent){
          if (err) {
            done(err);
          }
          saveKnowledge.saveKnowledgeFTS(
            dburi,
            "3",
            "ti it tl le",
            "co on nt te en nt",
            "au ut th ho or",
            function(err){
              if (err) done(err);
              saveTestData4(done);
          });
      });
  });
}

function saveTestData4(done){
  saveKnowledge.saveKnowledge(
    dburi,
    4,
    1,
    "test title",
    "content summary",
    "author",
    function(err, theKnowledge){
      if (err) done(err);
      saveKnowledge.saveKnowledgeContent(
        dburi,
        mongoose.Types.ObjectId(),
        4,
        1,
        "content",
        function(err, theKnowledgeContent){
          if (err) {
            done(err);
          }
          saveKnowledge.saveKnowledgeFTS(
            dburi,
            "4",
            "ti it tl le",
            "co on nt te en nt",
            "au ut th ho or",
            function(err){
              if (err) done(err);
              saveTestData5(done);
          });
      });
  });
}

function saveTestData5(done){
  saveKnowledge.saveKnowledge(
    dburi,
    5,
    1,
    "test title",
    "content summary",
    "author",
    function(err, theKnowledge){
      if (err) done(err);
      saveKnowledge.saveKnowledgeContent(
        dburi,
        mongoose.Types.ObjectId(),
        5,
        1,
        "content",
        function(err, theKnowledgeContent){
          if (err) {
            done(err);
          }
          saveKnowledge.saveKnowledgeFTS(
            dburi,
            "5",
            "ti it tl le",
            "co on nt te en nt",
            "au ut th ho or",
            function(err){
              if (err) done(err);
              saveTestData6(done);
          });
      });
  });
}

function saveTestData6(done){
  saveKnowledge.saveKnowledge(
    dburi,
    6,
    1,
    "test title",
    "content summary",
    "author",
    function(err, theKnowledge){
      if (err) done(err);
      saveKnowledge.saveKnowledgeContent(
        dburi,
        mongoose.Types.ObjectId(),
        6,
        1,
        "content",
        function(err, theKnowledgeContent){
          if (err) {
            done(err);
          }
          saveKnowledge.saveKnowledgeFTS(
            dburi,
            "6",
            "ti it tl le",
            "co on nt te en nt",
            "au ut th ho or",
            function(err){
              if (err) done(err);
              done();
          });
      });
  });
}

  describe('searchKnowledgeList()', function() {
    it('should read without error', function(done) {
      mongoose.connect(dburi, {useNewUrlParser: true});
      var db = mongoose.connection; 
      db.on('error', function(err){
        callback(err, null);
      });
      db.once('open', function() { 

        searchKnowledgeList.getList(
          null,
          "te en nt",
          5,
          0,
          function(res, searchstring, listKnowledge){
            assert.strictEqual(listKnowledge.length,5);
            done();
        });

      });
    });
  }); 



});
