var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  var Knowledge = models('Knowledge');
  Knowledge.find(
    {},
    '_id id title content_summary author accesscount like',
    function (err, docs) {
      if (err) {
        console.log('find error');
        return console.error(err);
      }
      renderNew(err, docs, res);
    }).sort({_id: -1}).limit(5);
});

function renderNew(err, docs, res){
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate' );
  res.setHeader( 'Pragma', 'no-cache' );
  res.render('new', {docs: docs});
}

module.exports = router;
