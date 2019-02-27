var csrf = require('csurf')
var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();
var flash = require("connect-flash");
var passport = require('passport')
var sanitize = require('mongo-sanitize');

var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })



router.get('/', csrfProtection, function(req, res, next) {
  res.render('login', 
    {username: sanitize(req.user), message: req.flash("error"),
     csrfToken: req.csrfToken() });
});
router.post('/', parseForm, csrfProtection,
  passport.authenticate('local', { successRedirect: '/admin/menu.html',
                                   failureRedirect: '/login.html',
                                   failureFlash: true })
);

module.exports = router;
