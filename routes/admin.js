var express = require('express');
var router = express.Router();

var isAdministrator = function(req, res, next){
    if(req.isAuthenticated() && req.user.role === 'administrator')
        return next();
    res.redirect("/login.html");
};

router.get("/menu.html", isAdministrator, function(req, res){
    res.render("menu", {user: req.user});
});

module.exports = router;
