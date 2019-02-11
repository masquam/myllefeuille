var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');
var url = require('url');

var parseForm = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res) {
  var url_parse = url.parse(req.url, true);
  var Knowledge = models('Knowledge');
  Knowledge
    .find()
    .sort({_id: -1})
    .skip(Number(url_parse.query.skip))
    .limit(5)
    .exec(function (err, docs) {
      if (err) {
        console.log('find error');
        return console.error(err);
      }
      renderNewAjax(err, docs, res);
    });
});

function renderNewAjax(err, docs, res){
  console.log('renderNewAjax');
  //res.header("Access-Control-Allow-Origin","*");
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log(JSON.stringify(docs));
  res.json(JSON.stringify(docs));
}

module.exports = router;
