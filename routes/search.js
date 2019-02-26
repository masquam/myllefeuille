var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');
var url = require('url');
var ngram = require('../lib/ngram');
var searchKnowledgeList = require('../lib/searchKnowledgeList');


router.get('/', function(req, res, next) {
  console.log("search.js");
  var url_parse = url.parse(req.url, true);
  var KnowledgeFTS = models('KnowledgeFTS');
  KnowledgeFTS
    .find(
        { $text : { $search : ngram.getNgramTextSpaceSeparated(url_parse.query.searchstring) } }, 
        { score : { $meta: "textScore" } }
    )
    .sort({ score : { $meta : 'textScore' } })
    .skip(Number(url_parse.query.skip))
    .limit(5)
    .exec(function (err, docs) {
      if (err) {
        console.log('search.js find error');
        return console.error(err);
      }
      console.log("search.js find success");
      ftsToKnowledges(err, docs, res, url_parse.query.searchstring);
    });
});

function ftsToKnowledges(err, docs, res, searchstring){
  var docsIdArray = [];
  for (var i = 0, len = docs.length; i < len; i++) {
    docsIdArray.push(docs[i].id);
  }
  console.log(docsIdArray);
  var Knowledge = models('Knowledge');
  Knowledge.find(
    {'id': { $in: docsIdArray}},
    '_id id title content_summary author accesscount like',
    function (err, docsKnowledge) {
      if (err) {
        console.log('find error');
        return console.error(err);
      }
      renderSearch(err, docsKnowledge, res, searchstring);
    });
}

function renderSearch(err, docsKnowledge, res, searchstring){
  console.log("rendering search.html...");
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate' );
  res.setHeader( 'Pragma', 'no-cache' );
  res.render('search', {docs: docsKnowledge, searchstring: searchstring});
}

module.exports = router;
