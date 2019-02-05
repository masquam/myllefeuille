// TODO: command line option to set username/password
// TODO: for the same username

var crypto = require("crypto");
var secretKey = "qw/lQwTSpbW#IW=R3+Ke";
var getHash = function(target){
        var sha = crypto.createHmac("sha256", secretKey);
            sha.update(target);
                return sha.digest("hex");
};
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/MongoDB', {useNewUrlParser: true});

var db = mongoose.connection; 

db.once('open', function() { 

  console.log("Database connection succeded."); 

  var authSchema = mongoose.Schema({ 
    username: 'string',
    password: 'string'
  });
  authSchema.methods.validPassword = function( pwd ) {
    return ( this.password === getHash(pwd) );
  };
  var User = mongoose.model('users', authSchema);

  console.log("start creating the user...");
  var testUser = new User();
  testUser.username = "testuser2";
  testUser.password = getHash("password");
  testUser.save(function(err, user){
    if (err) return console.error(err); 
    console.log("completed.");
    process.exit(0);
  });

}); 
