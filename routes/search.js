var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');
var url = require('url');
var ngram = require('../lib/ngram');
var searchKnowledgeList = require('../lib/searchKnowledgeList');


router.get('/', function(req, res, next) {
  console.log("search.js start");
  var url_parse = url.parse(req.url, true);
  searchKnowledgeList.getList(
    res,
    ngram.getNgramTextSpaceSeparated(url_parse.query.searchstring),
    5,
    Number(url_parse.query.skip),
    function (res, searchstring, listKnowledge){
      console.log("rendering search.html...");
      res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate' );
      res.setHeader( 'Pragma', 'no-cache' );
      res.render('search', {docs: listKnowledge, searchstring: searchstring});
    });
});


module.exports = router;
