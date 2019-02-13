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
      res.render("makeconfirm", {title: req.body.ktitle, content: req.body.content, csrfToken: req.csrfToken(), saveToken: objid});
    });
  }); 

});

router.post('/save.html', parseForm, isLogined, csrfProtection,
  function(req, res){
  mongoose.connect('mongodb://localhost:27017/myllefeuille', {useNewUrlParser: true});
  //console.log("saveToken=" + req.body.saveToken);
  var saveToken = models('saveToken');
  saveToken.findById(req.body.saveToken, function (err, savetoken) {
    handleSaveHtmlSaveToken(err, savetoken, saveToken, req, res);
  });
});

function handleSaveHtmlSaveToken(err, savetoken, saveToken, req, res){
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
      executeSave(err, counter, req, res);
    });
  }
}

function executeSave(err, counter, req, res){
  var Knowledge = models('Knowledge');
  var theKnowl = new Knowledge();
  theKnowl._id = mongoose.Types.ObjectId();
  theKnowl.id = counter['sequence'];
  theKnowl.version = 1;
  theKnowl.current = true;
  theKnowl.title = req.body.ktitle;
  theKnowl.content_summary = req.body.content.substring(0, 80);
  theKnowl.author = req.user.username;
  theKnowl.accesscount = 0;
  theKnowl.like = 0;
    console.log("Knowledge saving: id=" + theKnowl.id);
  theKnowl.save(function(err){
    if (err) return console.error(err); 
    console.log("Knowledge saved: id=" + theKnowl.id);
    saveKnowledgeContent(err, counter, res, req, theKnowl)
  });
}

function saveKnowledgeContent(err, counter, res, req, theKnowl){
  var KnowledgeContents = models('KnowledgeContents');
  var theKnowlContent = new KnowledgeContents();
  theKnowlContent._id = theKnowl._id;
  theKnowlContent.id = theKnowl.id;
  theKnowlContent.version = theKnowl.version;
  theKnowlContent.content = req.body.content;
  theKnowlContent.save(function(err){
    if (err) return console.error(err); 
    console.log("KnowledgeContent saved: id=" + theKnowl.id);
    saveKnowledgeFTS(err, counter, res, req, theKnowl, theKnowlContent);
  });
}

function saveKnowledgeFTS(err, counter, res, req, theKnowl, theKnowlContent){
  var KnowledgeFTS = models('KnowledgeFTS');
  var theKnowlFTS = new KnowledgeFTS();
  theKnowlFTS.id = theKnowl.id.toString();
  theKnowlFTS.title = theKnowl.title;
  theKnowlFTS.content = theKnowlContent.content;
  theKnowlFTS.author = theKnowl.author;
  theKnowlFTS.save(function(err){
    if (err) return console.error(err); 
    console.log("KnowledgeFTS saved: id=" + theKnowl.id);
    renderSaveHtml(err, counter, req, res);
  });
}

function renderSaveHtml(err, counter, req, res){
  if (err) {
    console.log("counter update error.");
    next(err);
  }
  res.render("save", {content: counter['sequence'].toString(), csrfToken: req.csrfToken()});
}


module.exports = router;
