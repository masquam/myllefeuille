var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');
var url = require('url');

router.get('/', function(req, res, next) {
  console.log("search.js");
  var url_parse = url.parse(req.url, true);
  var KnowledgeFTS = models('KnowledgeFTS');
  KnowledgeFTS
    .find(
        { $text : { $search : url_parse.query.searchstring } }, 
        { score : { $meta: "textScore" } }
    )
    .sort({ score : { $meta : 'textScore' } })
    .skip(Number(url_parse.query.skip))
    .limit(5)
    .exec(function (err, docs) {
      if (err) {
        console.log('find error');
        return console.error(err);
      }
      console.log("search.js find success");
      renderSearch(err, docs, res, url_parse.query.searchstring);
    });
});

function renderSearch(err, docs, res, searchstring){
  console.log("rendering search.html...");
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate' );
  res.setHeader( 'Pragma', 'no-cache' );
  res.render('search', {docs: docs, searchstring: searchstring});
}

module.exports = router;
