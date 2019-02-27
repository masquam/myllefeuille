var csrf = require('csurf')
var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var flash = require("connect-flash");
var passport = require('passport')
var mongoose = require('mongoose')
var url = require('url');
;
var models = require('../models');
var ngram = require('../lib/ngram');
var handlesaveToken = require('../lib/handlesaveToken');
var counters = require('../lib/counters');
var saveKnowledge = require('../lib/saveKnowledge');
var searchKnowledgeList = require('../lib/searchKnowledgeList');
var readKnowledge = require('../lib/readKnowledge');


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
  mongoose.connect(dburi, {useNewUrlParser: true});
  var db = mongoose.connection; 
  db.on('error', function(err){
    next(err);
  });
  db.once('open', function() { 
    handlesaveToken.generateAndSave("saveKnowledge", function(err, objid){
      if (err) return console.error(err); 
      res.render("makeconfirm", 
        {title: req.body.ktitle, content: req.body.content,
        csrfToken: req.csrfToken(), saveToken: objid});
    });
  });
});

router.post('/save.html', parseForm, isLogined, csrfProtection,
    function(req, res){
  mongoose.connect(dburi, {useNewUrlParser: true});
  var db = mongoose.connection; 
  db.on('error', function(err){
    callback(err, null);
  });
  db.once('open', function() { 
    handlesaveToken.findTokenByid(req.body.saveToken, function(err, savetoken){
      handleSaveHtmlSaveToken(err, savetoken, req, res);
    });
  });
});

function handleSaveHtmlSaveToken(err, savetoken, req, res){
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
    handlesaveToken.DeleteToken(req.body.saveToken, function (err, doc){
      if (err) {
        console.log("saveToken delete error.");
        // do not execute next(err)
      }
    });
    counters.increment(dburi, "knowledgeCounter", function(err, counter){
      if (err) {
        next(err);
      }
      counterValue = counter['sequence'];
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
      if (err) {
        next(err);
      }
      console.log("Knowledge saved: id=" + theKnowledge.id);
      saveKnowledgeContent(err, req, res, theKnowledge)
  });
}

function saveKnowledgeContent(err, req, res, theKnowledge){
  saveKnowledge.saveKnowledgeContent(
    dburi,
    theKnowledge._id,
    theKnowledge.id,
    theKnowledge.version,
    req.body.content,
    function(err, theKnowledgeContent){
      if (err) {
        next(err);
      }
      console.log("KnowledgeContent saved: id=" + theKnowledge.id);
      saveKnowledgeFTS(err, counterValue, req, res, theKnowledge, req.body.content);
  });
}

function saveKnowledgeFTS(err, counterValue, req, res, theKnowledge, content){
  saveKnowledge.saveKnowledgeFTS(
    dburi,
    ngram.getNgramText(theKnowledge.id.toString()),
    ngram.getNgramText(theKnowledge.title),
    ngram.getNgramText(content),
    ngram.getNgramText(theKnowledge.author),
    function(err){
      if (err) {
        next(err);
      }
      console.log("KnowledgeFTS saved: id=" + theKnowledge.id.toString());
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

router.get("/select.html", csrfProtection, isLogined, function(req, res){
    res.render("select", {user: req.user, csrfToken: req.csrfToken()});
});

router.get("/selectresult.html", csrfProtection, isLogined, function(req, res){
    // TODO: POST selectresult => a knowledge => back button
    res.redirect("/admin/select.html");
});

router.post("/selectresult.html", csrfProtection, isLogined, function(req, res){
  console.log("selectresult start");
  //var url_parse = url.parse(req.url, true);
  searchKnowledgeList.getList(
    res,
    ngram.getNgramTextSpaceSeparated(req.body.searchstring),
    5,
    Number(req.body.skip),
    function (err, res, searchstring, listKnowledge){
      if (err) {
        console.log('search.js Knowledge find error');
        next(err);
      } else {
        console.log("rendering search.html...");
        res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader( 'Pragma', 'no-cache' );
        res.render('selectresult', {docs: listKnowledge, searchstring: searchstring});
      }
    });
});

router.get("/edit.html", csrfProtection, isLogined, function(req, res){
  console.log("edit.html start");
  var url_parse = url.parse(req.url, true);
  readKnowledge.read(
    res,
    Number(url_parse.query.id),
    function(err, res, id, knowledge, knowledgeContent){
      if (err) {
        next(err);
      } else {
        console.log("rendering: id=" + id);
        res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader( 'Pragma', 'no-cache' );
        res.render("edit",
          { user: req.user,
            title: knowledge.title,
            content: knowledgeContent.content,
            id: id,
            csrfToken: req.csrfToken()});
      }
  });

});

router.post('/editconfirm.html', parseForm, isLogined, csrfProtection,
    function(req, res){
  mongoose.connect(dburi, {useNewUrlParser: true});
  var db = mongoose.connection; 
  db.on('error', function(err){
    next(err);
  });
  db.once('open', function() { 
    handlesaveToken.generateAndSave("saveKnowledge", function(err, objid){
      if (err) return console.error(err); 
      res.render("editconfirm", 
        {title: req.body.ktitle, content: req.body.content,
        csrfToken: req.csrfToken(), saveToken: objid, id: req.body.id});
    });
  });
});

router.post('/update.html', parseForm, isLogined, csrfProtection,
    function(req, res){
  mongoose.connect(dburi, {useNewUrlParser: true});
  var db = mongoose.connection; 
  db.on('error', function(err){
    callback(err, null);
  });
  db.once('open', function() { 
    handlesaveToken.findTokenByid(req.body.saveToken, function(err, savetoken){
      handleSaveHtmlSaveToken(err, savetoken, req, res);
    });
  });
});
module.exports = router;
