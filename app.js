var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var csrf = require('csurf')
var logger = require('morgan');

var indexRouter = require('./routes/index');
var newRouter = require('./routes/new');
var newAjaxRouter = require('./routes/newAjax');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var adminRouter = require('./routes/admin');

var app = express();
var session = require('express-session');

var crypto = require("crypto");
var secretKey = "qw/lQwTSpbW#IW=R3+Ke";
var getHash = function(target){
        var sha = crypto.createHmac("sha256", secretKey);
            sha.update(target);
                return sha.digest("hex");
};
var flash = require("connect-flash");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myllefeuille', {useNewUrlParser: true});
var authSchema = mongoose.Schema({ 
  username: 'string',
  password: 'string',
  role: 'string'
});
authSchema.methods.validPassword = function( pwd ) {
    return ( this.password === getHash(pwd) );
};
var User = mongoose.model('users', authSchema);

var models = require('./models');

passport.use(new LocalStrategy({
  passReqToCallback : true
}, function(req, username, password, done) {
    process.nextTick(function(){
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          req.flash('error', 'ユーザーが見つかりませんでした。');
          return done(null, false);
        }
        if (!user.validPassword(password)) {
          req.flash('error', 'パスワードが間違っています。');
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// CORS
//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: "v()j&ek3n=;NvQ>5Eu#="}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/new.html', newRouter);
app.use('/newAjax.json', newAjaxRouter);
app.use('/users.html', usersRouter);
app.use('/login.html', loginRouter);
app.use('/logout.html', logoutRouter);
app.use('/admin/', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
