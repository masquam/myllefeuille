var fs = require('fs');
var express = require('express')
var multer  = require('multer')
var router = express.Router();

const config = require('../config/config');
const resourcefile = config.resource.file;
const resource = require('../config/' + resourcefile);
const { dbconf: { host, port, name } } = config;
const dburi = `mongodb://${host}:${port}/${name}`;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("multer.diskStorage directory = " + req.body.directory);
    fs.mkdir('./public/img/' + req.body.directory, function(err){
      if (err) {
        if (err.code === 'EEXIST') {
          console.log("Directory already exists.");
          //cb(null, './public/img/' + req.body.directory);
        } else {
          return console.error(err);
        }
      }
      console.log("Directory created successfully.");
      cb(null, './public/img/' + req.body.directory)
    });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log("file.originalname = " + file.originalname);
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      console.log("invalid upload file");
      return cb(new Error('invalid upload file'));
    }
    cb(null, true);
  }
}).single('upfile');
var bodyParser = require('body-parser')
var csrf = require('csurf')
var flash = require("connect-flash")
var passport = require('passport')
var mongoose = require('mongoose')
var url = require('url')
const path = require('path');

var models = require('../models');
var ngram = require('../lib/ngram');
var handlesaveToken = require('../lib/handlesaveToken');
var counters = require('../lib/counters');
var markup = require('../lib/markup');
var saveKnowledge = require('../lib/saveKnowledge');
var searchKnowledgeList = require('../lib/searchKnowledgeList');
var readKnowledge = require('../lib/readKnowledge');
var editKnowledge = require('../lib/editKnowledge');
var userMaintenance = require('../lib/userMaintenance');
var validatePassword = require('../lib/validatePassword');

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
    res.render("menu", {user: req.user, 
                        resource: resource.menu });
});

router.get("/make.html", csrfProtection, isLogined, function(req, res){
    res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader( 'Pragma', 'no-cache' );
    res.render("make", 
      {directory: mongoose.Types.ObjectId(),
       csrfToken: req.csrfToken(),
       resource: resource.make });
});

router.post("/make.html", csrfProtection, isLogined, function(req, res){
  handlesaveToken.DeleteToken(req.body.saveToken, function(err, objid){
    // nop
  });
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader( 'Pragma', 'no-cache' );
  res.render("make", 
    {title: req.body.ktitle,
     content: req.body.content,
     directory: req.body.directory,
     csrfToken: req.csrfToken(),
       resource: resource.make });
});

router.post('/uploadimage', parseForm, isLogined, csrfProtection,
    function (req, res, next) {
  console.log("start upload image");
  console.log("directory = " + req.body.directory);
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      next(err);
    } else {
      // Everything went fine.
      console.log("upload done: " + req.file.originalname);
      res.send(JSON.stringify('Ok'));
    }
  })
})

router.post('/makeconfirm.html', parseForm, isLogined, csrfProtection,
    function(req, res){
  handlesaveToken.generateAndSave("saveKnowledge", function(err, objid){
    if (err) return console.error(err); 
    res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader( 'Pragma', 'no-cache' );
    res.render("makeconfirm", 
      {title: req.body.ktitle,
       content: req.body.content,
       directory: req.body.directory,
       displaycontent: markup.getMarkedUpText(req.body.content),
       csrfToken: req.csrfToken(), saveToken: objid, 
       resource: resource.makeconfirm });
  });
});

router.post('/save.html', parseForm, isLogined, csrfProtection,
    function(req, res){
  handlesaveToken.findTokenByid(req.body.saveToken, function(err, savetoken){
    handleSaveHtmlSaveToken(err, savetoken, req, res);
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
  console.log("executeSave directory = " + req.body.directory);
  saveKnowledge.saveKnowledge(
    dburi,
    counterValue,
    1,
    req.body.ktitle,
    req.body.content.substring(0, 80),
    req.user.username,
    req.body.directory,
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
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader( 'Pragma', 'no-cache' );
  res.render("save", {content: counterValue.toString(),
                      csrfToken: req.csrfToken(),
                      resource: resource.save });
}

router.get("/select.html", csrfProtection, isLogined, function(req, res){
    res.render("select", {csrfToken: req.csrfToken(),
                          resource: resource.select});
});

router.get("/selectresult.html", csrfProtection, isLogined, function(req, res){
    // TODO: POST selectresult => a knowledge => back button
    res.redirect("/admin/select.html");
});

router.post("/selectresult.html", csrfProtection, isLogined, function(req, res){
  console.log("selectresult start");
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
        res.render('selectresult', 
          {docs: listKnowledge, searchstring: searchstring,
           resource: resource.selectresult });
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
          { title: knowledge.title,
            content: knowledgeContent.content,
            id: id,
            directory: knowledge.imgdir,
            csrfToken: req.csrfToken(), 
            resource: resource.edit });
      }
  });

});

router.post("/edit.html", csrfProtection, isLogined, function(req, res){
  console.log("POST edit.html start");
  var url_parse = url.parse(req.url, true);
  var id = Number(url_parse.query.id);
  console.log("rendering: id=" + id);
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader( 'Pragma', 'no-cache' );
  res.render("edit",
    { title: req.body.ktitle,
      content: req.body.content,
      id: id,
      directory: req.body.directory,
      csrfToken: req.csrfToken(),
      resource: resource.edit });
});

router.post('/editconfirm.html', parseForm, isLogined, csrfProtection,
    function(req, res){
  handlesaveToken.generateAndSave("saveKnowledge", function(err, objid){
    if (err) return console.error(err); 
    res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader( 'Pragma', 'no-cache' );
    res.render("editconfirm", 
      {title: req.body.ktitle,
       content: req.body.content,
       displaycontent: markup.getMarkedUpText(req.body.content),
       directory: req.body.directory,
       csrfToken: req.csrfToken(),
       saveToken: objid, id: req.body.id,
       resource: resource.editconfirm });
  });
});

router.post('/update.html', parseForm, isLogined, csrfProtection,
    function(req, res){
  handlesaveToken.findTokenByid(req.body.saveToken, function(err, savetoken){
    handleUpdateHtmlSaveToken(err, savetoken, req, res);
  });
});

function handleUpdateHtmlSaveToken(err, savetoken, req, res){
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
    executeUpdate(err, req, res);
  }
}

function executeUpdate(err, req, res){
  editKnowledge.updateKnowledge(
    req.body.id,
    1, // TODO: version number update
    req.body.ktitle,
    req.body.content.substring(0, 80),
    Date.now(),
    req.user.username,
    req.body.directory,
    function(err, theKnowledge){
      if (err) {
        next(err);
      }
      console.log("Knowledge updated: id=" + theKnowledge.id);
      updateKnowledgeContent(err, req, res, theKnowledge)
  });
}

function updateKnowledgeContent(err, req, res, theKnowledge){
  editKnowledge.updateKnowledgeContent(
    theKnowledge.id,
    theKnowledge.version,
    req.body.content,
    function(err, theKnowledgeContent){
      if (err) {
        next(err);
      }
      console.log("KnowledgeContent saved: id=" + theKnowledge.id);
      updateKnowledgeFTS(err, req, res, theKnowledge, req.body.content);
  });
}

function updateKnowledgeFTS(err, req, res, theKnowledge, content){
  editKnowledge.updateKnowledgeFTS(
    ngram.getNgramText(theKnowledge.id.toString()),
    ngram.getNgramText(theKnowledge.title),
    ngram.getNgramText(content),
    ngram.getNgramText(theKnowledge.author),
    function(err, doc){
      if (err) {
        next(err);
      }
      console.log("KnowledgeFTS saved: id=" + theKnowledge.id.toString());
      // render the same as save.html
      renderSaveHtml(err, theKnowledge.id, req, res);
  });
}

router.get("/changepw.html", csrfProtection, isLogined, function(req, res){
  res.render("changepw", {user: req.user, csrfToken: req.csrfToken(),
                          resource: resource.changepw });
});

router.post("/changepw.html", csrfProtection, isLogined, function(req, res){
  if (validatePassword.validate(req.body.password) === false) {
    res.render("changepw", 
      {user: req.user, csrfToken: req.csrfToken(),
       message: resource.changepw.notSatisfiedPasswordPolicy,
       resource: resource.changepw });
  } else {
    userMaintenance.updatePassword(
      req.body.username,
      req.body.password,
      function(err, theUser){
        if (err) {
          next(err);
        } else {
          res.redirect("/admin/savepw.html");
        }
    });
  }
});

router.get("/savepw.html", csrfProtection, isLogined, function(req, res){
  res.render("savepw", {csrfToken: req.csrfToken(),
                        resource: resource.savepw });
});

router.get("/createuser.html", csrfProtection, isAdministrator,
    function(req, res){
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader( 'Pragma', 'no-cache' );
  res.render("createuser", {csrfToken: req.csrfToken(),
                            resource: resource.createuser });
});

router.post("/createuser.html", csrfProtection, isAdministrator,
    function(req, res){
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader( 'Pragma', 'no-cache' );
  userMaintenance.findOne(req.body.username, function(err, theUser){
    if (theUser){
      res.render("createuser", 
        {user: req.user, csrfToken: req.csrfToken(),
         message: "ユーザーIDは既に使用されています。"});
    } else if (validatePassword.validate(req.body.password) === false) {
      res.render("createuser", 
        {user: req.user, csrfToken: req.csrfToken(),
         message: "パスワード・ポリシーを満たしていません。"});
    } else {
      userMaintenance.createUser(
        req.body.username,
        req.body.displayname,
        req.body.password,
        req.body.admin,
        function(err, theUser){
          if (err) {
            next(err);
          } else {
            res.redirect("/admin/saveuser.html");
          }
      });
    }
  }); 
});

router.get("/saveuser.html", csrfProtection, isAdministrator,
    function(req, res){
  res.render("saveuser", {csrfToken: req.csrfToken(),
                          resource: resource.saveuser });
});


router.get('/searchuser.html', isAdministrator, function(req, res) {
  var findparameters = {};
  if (!!req.query.searchstring) {
    findparameters = { "displayname": { $regex: '.*' + req.query.searchstring + '.*' , $options: 'i'} }
  }
  userMaintenance.findUsers(
    findparameters,
    function (err, docs) {
      if (err) {
        console.log('searchuser.html find error');
        next(err);
      } else {
        renderSearchUser(err, docs, res, req.query.searchstring);
      }
    });
});

function renderSearchUser(err, docs, res, searchstring){
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate' );
  res.setHeader( 'Pragma', 'no-cache' );
  res.render('searchuser', {docs: docs, searchstring: searchstring,
                            resource: resource.searchuser});
}

router.get("/edituser.html", csrfProtection, isAdministrator,
    function(req, res){
  userMaintenance.findOneById(
    req.query.id,
    function(err, theUser){
      if (err) {
        next(err);
      } else {
        if (theUser === null){
          return res.render("edituser_error", {resource: resource.edituser_error});
        }
        res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader( 'Pragma', 'no-cache' );
        res.render("edituser", 
          {id: theUser._id,
           username: theUser.username,
           displayname: theUser.displayname,
           admin: (theUser.role === 'administrator'),
           csrfToken: req.csrfToken(), 
           resource: resource.edituser});
      }
  });
});

router.post("/edituser.html", csrfProtection, isAdministrator,
    function(req, res){
  console.log("id = " + req.body.id);
  console.log("username = " + req.body.username);
  console.log("displayname = " + req.body.displayname);
  console.log("admin = " + req.body.admin);
  console.log("deleteUser = " + req.body.deleteUser);

  if (req.body.deleteUser === "true") {
    console.log("edituser.html deleteUser start");
    userMaintenance.deleteUserById(
      req.body.id,
      function(err, theUser){
        if (err) {
          res.render("edituser_error");
        } else {
          res.redirect("/admin/deleteuser.html");
        }
    });
  } else {
    userMaintenance.editUser(
      req.body.id,
      req.body.displayname,
      req.body.admin,
      function(err, theUser){
        if (err) {
          next(err);
        } else {
          res.redirect("/admin/edituserresult.html");
        }
    });
  }
});

router.get("/edituserresult.html", csrfProtection, isAdministrator,
    function(req, res){
  res.render("edituserresult", {csrfToken: req.csrfToken(),
                                resource: resource.edituserresult });
});

router.get("/deleteuser.html", csrfProtection, isAdministrator,
    function(req, res){
  res.render("deleteuser", {csrfToken: req.csrfToken(), 
                            resource: resource.deleteuser});
});

router.get('/searchuserpw.html', isAdministrator, function(req, res) {
  var findparameters = {};
  if (!!req.query.searchstring) {
    findparameters = { "displayname": { $regex: '.*' + req.query.searchstring + '.*' , $options: 'i'} }
  }
  userMaintenance.findUsers(
    findparameters,
    function (err, docs) {
      if (err) {
        console.log('searchuser.html find error');
        next(err);
      } else {
        renderSearchUserPw(err, docs, res, req.query.searchstring);
      }
    });
});

function renderSearchUserPw(err, docs, res, searchstring){
  res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate' );
  res.setHeader( 'Pragma', 'no-cache' );
  res.render('searchuserpw', {docs: docs, searchstring: searchstring,
                              resource: resource.searchuserpw });
}


router.get("/edituserpw.html", csrfProtection, isAdministrator,
    function(req, res){
  userMaintenance.findOneById(
    req.query.id,
    function(err, theUser){
      if (err) {
        next(err);
      } else {
        if (theUser === null){
          return res.render("edituser_error");
        }
        res.setHeader( 'Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader( 'Pragma', 'no-cache' );
        res.render("edituserpw", 
          {id: theUser._id,
           username: theUser.username,
           displayname: theUser.displayname,
           admin: (theUser.role === 'administrator'),
           csrfToken: req.csrfToken(),
           resource: resource.edituserpw });
      }
  });
});

router.post("/edituserpw.html", csrfProtection, isAdministrator,
    function(req, res){
  console.log("username = " + req.body.username);

  userMaintenance.updatePassword(
    req.body.username,
    req.body.password,
    function(err, theUser){
      if (err) {
        next(err);
      } else {
        res.redirect("/admin/edituserpwresult.html");
      }
  });

});

router.get("/edituserpwresult.html", csrfProtection, isAdministrator,
    function(req, res){
  res.render("edituserpwresult", {csrfToken: req.csrfToken(), 
                                  resource: resource.edituserpwresult});
});


module.exports = router;
