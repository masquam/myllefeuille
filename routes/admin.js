var express = require('express');
var router = express.Router();

var isLogined = function(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect("/login.html");
};

router.get("/useronly.html", isLogined, function(req, res){
    res.render("useronly", {user: req.user});
});

module.exports = router;
