var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');
var url = require('url');
var ngram = require('../lib/ngram');

var parseForm = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res) {
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
        console.log('searchAjax.js find error');
        return console.error(err);
      }
      console.log("searchAjax.js find success");
      ftsToKnowledges(err, docs, res);
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
      renderNewAjax(err, docsKnowledge, res);
    });
}

function renderNewAjax(err, docsKnowledge, res){
  res.json(JSON.stringify(docsKnowledge));
}

module.exports = router;
