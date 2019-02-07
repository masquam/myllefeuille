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

  var objid = mongoose.Types.ObjectId();
  mongoose.connect('mongodb://localhost:27017/myllefeuille', {useNewUrlParser: true});
  var db = mongoose.connection; 
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() { 
    var saveToken = models('saveToken');
    var theToken = new saveToken();
    theToken._id = objid;
    theToken.tokenType = "saveKnowledge";
    theToken.save(function(err, user){
      if (err) return console.error(err); 
      console.log("completed.");
      res.render("makeconfirm", {content: req.body.content, csrfToken: req.csrfToken(), saveToken: objid});
    });
  }); 

});

router.post('/save.html', parseForm, isLogined, csrfProtection,
  function(req, res){
  mongoose.connect('mongodb://localhost:27017/myllefeuille', {useNewUrlParser: true});
  //console.log("saveToken=" + req.body.saveToken);
  var saveToken = models('saveToken');
  saveToken.findById(req.body.saveToken, function (err, savetoken) {
    if (savetoken == null){
      console.log("old saveToken.");
      res.render("save", {content: "already saved", csrfToken: req.csrfToken()});
    }
    else
    {
      if (err) {
        console.log("saveToken find error.");
        next(err);
      }
      saveToken.findOneAndDelete({_id: req.body.saveToken},function (err, doc) {
        if (err) {
          console.log("saveToken delete error.");
        }
      });

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
        res.render("save", {content: counter['sequence'].toString(), csrfToken: req.csrfToken()});
        // TODO: F5 -> re-save
      });
    }
  });
});

module.exports = router;
