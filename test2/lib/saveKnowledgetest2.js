var assert = require('assert');
var mongoose = require('mongoose');
var models = require('../../models');
var saveKnowledge = require('../../lib/saveKnowledge');

var dburi = "mongodb://localhost:65535/myllefeuilletest";

describe("saveKnowledge", function() {
  this.timeout(10000);

  describe('saveKnowledge()', function() {
    it('error occurs when dburi is not specified', function(done) {
      saveKnowledge.saveKnowledge(
        dburi,
        1,
        1,
        "test title",
        "content summary",
        "author",
        function(err, theKnowledge){
          if (err) { 
            console.log("*************** the error is expected *************");
            done();
          } else {
            done(err);
          }
      });
    });
  });


});
