var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');

const config = require('../config/config');
const resourcefile = config.resource.file;
const resource = require('../config/' + resourcefile);

router.get('/', function(req, res, next) {
  var Knowledge = models('Knowledge');
  Knowledge.find(
    {},
    '_id id title timestamp author accesscount like',
    function (err, docs) {
      if (err) {
        console.log('index.html find error');
        next(err);
      }
      renderIndex(err, docs, res);
    }).sort({timestamp: -1}).limit(5);
});

function renderIndex(err, docs, res){
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate' );
  res.setHeader( 'Pragma', 'no-cache' );
  res.render('index', {docs: docs, resource: resource.index});
}



module.exports = router;
