var csrf = require('csurf')
var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var flash = require("connect-flash");
var passport = require('passport')
var mongoose = require('mongoose');
var models = require('../models');
var ngram = require('../lib/ngram');
var saveToken = require('../lib/saveToken');
var counters = require('../lib/counters');
var saveKnowledge = require('../lib/saveKnowledge');

var dburi = "mongodb://localhost:27017/myllefeuille";

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
  saveToken.generateAndSave(dburi, "saveKnowledge", function(err, objid){
      if (err) return console.error(err); 
      res.render("makeconfirm", 
        {title: req.body.ktitle, content: req.body.content,
         csrfToken: req.csrfToken(), saveToken: objid});
  });
});

router.post('/save.html', parseForm, isLogined, csrfProtection,
  function(req, res){
  mongoose.connect(dburi, {useNewUrlParser: true});
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
    counters.increment(dburi, "knowledgeCounter", function(err, counter){
      if (err) return console.error(err);
      if (counter == null) {
        counterValue = 1
      } else {
        counterValue = counter['sequence'];
      }
      executeSave(err, counterValue, req, res);
    });
  }
}

function executeSave(err, counterValue, req, res){
  saveKnowledge.saveKnowledge(
    dburi,
    counterValue,
    1,
    req.body.ktitle,
    req.body.content.substring(0, 80),
    req.user.username,
    function(err, theKnowledge){
      if (err) return console.error(err);
      saveKnowledgeContent(err, req, res, theKnowledge)
  });
}

function saveKnowledgeContent(err, req, res, theKnowl){
  var KnowledgeContents = models('KnowledgeContents');
  var theKnowlContent = new KnowledgeContents();
  theKnowlContent._id = theKnowl._id;
  theKnowlContent.id = theKnowl.id;
  theKnowlContent.version = theKnowl.version;
  theKnowlContent.content = req.body.content;
  theKnowlContent.save(function(err){
    if (err) return console.error(err); 
    console.log("KnowledgeContent saved: id=" + theKnowl.id);
    saveKnowledgeFTS(err, counterValue, res, req, theKnowl, theKnowlContent);
  });
}

function saveKnowledgeFTS(err, counterValue, res, req, theKnowl, theKnowlContent){
  var KnowledgeFTS = models('KnowledgeFTS');
  var theKnowlFTS = new KnowledgeFTS();
  theKnowlFTS.id = theKnowl.id.toString();
  theKnowlFTS.title = ngram.getNgramText(theKnowl.title);
  theKnowlFTS.content = ngram.getNgramText(theKnowlContent.content);
  theKnowlFTS.author = ngram.getNgramText(theKnowl.author);
  theKnowlFTS.save(function(err){
    if (err) return console.error(err); 
    console.log("KnowledgeFTS saved: id=" + theKnowl.id);
    renderSaveHtml(err, counterValue, req, res);
  });
}

function renderSaveHtml(err, counterValue, req, res){
  if (err) {
    console.log("counter update error.");
    next(err);
  }
  res.render("save", {content: counterValue.toString(), csrfToken: req.csrfToken()});
}


module.exports = router;
