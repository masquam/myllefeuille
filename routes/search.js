var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');
var url = require('url');
var ngram = require('../lib/ngram');
var searchKnowledgeList = require('../lib/searchKnowledgeList');

const config = require('../config/config');
const resourcefile = config.resource.file;
const resource = require('../config/' + resourcefile);

router.get('/', function(req, res, next) {
  console.log("search.js start");
  var url_parse = url.parse(req.url, true);
  searchKnowledgeList.getList(
    res,
    ngram.getNgramTextSpaceSeparated(url_parse.query.searchstring),
    5,
    Number(url_parse.query.skip),
    function (err, res, searchstring, listKnowledge){
      if (err) {
        console.log('search.js Knowledge find error');
        next(err);
      } else {
        console.log("rendering search.html...");
        res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader( 'Pragma', 'no-cache' );
        res.render('search', {docs: listKnowledge,
                              searchstring: url_parse.query.searchstring,
                              resource: resource.search });
      }
    });
});


module.exports = router;
