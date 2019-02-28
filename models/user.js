let mongoose = require('mongoose');

let crypto = require("crypto");
let secretKey = "qw/lQwTSpbW#IW=R3+Ke";
let getHash = function(target){
        let sha = crypto.createHmac("sha256", secretKey);
            sha.update(target);
                return sha.digest("hex");
};


let authSchema = mongoose.Schema({ 
  username: 'string',
  displayname: 'string',
  password: 'string',
  role: 'string'
});
authSchema.methods.validPassword = function( pwd ) {
    return ( this.password === getHash(pwd) );
};

module.exports = mongoose.model('User', authSchema);
