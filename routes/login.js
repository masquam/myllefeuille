var express = require('express');
var router = express.Router();
var flash = require("connect-flash");
var passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {username: req.user, message: req.flash("error")});
});
router.post('/',
  passport.authenticate('local', { successRedirect: '/admin/useronly.html',
                                   failureRedirect: '/login.html',
                                   failureFlash: true })
);

module.exports = router;
