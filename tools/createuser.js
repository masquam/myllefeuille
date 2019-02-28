// TODO: command line option to set username/password
// TODO: same username check

var crypto = require("crypto");
var secretKey = "qw/lQwTSpbW#IW=R3+Ke";
var getHash = function(target){
        var sha = crypto.createHmac("sha256", secretKey);
            sha.update(target);
                return sha.digest("hex");
};
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myllefeuille', {useNewUrlParser: true});

var db = mongoose.connection; 

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() { 

  console.log("Database connection succeded."); 

  var authSchema = mongoose.Schema({ 
    username: 'string',
    password: 'string',
    role: 'string'
  });
  authSchema.methods.validPassword = function( pwd ) {
    return ( this.password === getHash(pwd) );
  };
  var User = mongoose.model('users', authSchema);

  console.log("start creating the user...");
  var testUser = new User();
  testUser.username = "testuser";
  testUser.password = getHash("Ab$de123");
  testUser.role = "administrator";
  testUser.save(function(err, user){
    if (err) return console.error(err); 
    console.log("completed.");
    process.exit(0);
  });

}); 
