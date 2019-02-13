var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate' );
  res.setHeader( 'Pragma', 'no-cache' );
  res.render('search', {});
});

module.exports = router;
