var csrf = require('csurf')
var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var flash = require("connect-flash");
var passport = require('passport')
var mongoose = require('mongoose');
var models = require('../models');

var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

var isLogined = function(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect("/login.html");
};
var isAdministrator = function(req, res, next){
    if(req.isAuthenticated() && req.user.role === 'administrator')
        return next();
    res.redirect("/login.html");
};

router.get("/menu.html", isLogined, function(req, res){
    res.render("menu", {user: req.user});
});
router.get("/make.html", csrfProtection, isLogined, function(req, res){
    res.render("make", {user: req.user, csrfToken: req.csrfToken()});
});

router.post('/makeconfirm.html', parseForm, isLogined, csrfProtection,
  function(req, res){
    res.render("makeconfirm", {content: req.body.content, csrfToken: req.csrfToken()});
});

router.post('/save.html', parseForm, isLogined, csrfProtection,
  function(req, res){
  mongoose.connect('mongodb://localhost:27017/myllefeuille', {useNewUrlParser: true});
  var Counters = models('Counters');
  var query = {_id: 'knowledgeCounter'};
  var update = {$inc: {sequence: 1}};
  var options = {upsert: true};
  Counters.findOneAndUpdate(query, update, options, function(err, counter)
  {
    if (err) {
      console.log("counter update error.");
      next(err);
    }
    res.render("save", {content: counter['sequence'].toString()});
  });

});

module.exports = router;
