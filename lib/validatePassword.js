var passwordValidator = require('password-validator');

/**
 * validate password
 *
 *
 * @param {string} password password string
 * @param callback callback function(err, res, searchstring, listKnowledge)
 */
exports.validate = function(password) {
  var schema = new passwordValidator();
  schema
  .is().min(8)                                  // Minimum length 8
  .is().max(100)                                // Maximum length 100
  .has().uppercase()                            // Must have uppercase letters
  .has().lowercase()                            // Must have lowercase letters
  .has().digits()                               // Must have digits
  .has().symbols()                              // Must have symbols
  .has().not().spaces()                         // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
  return schema.validate(password);
}
