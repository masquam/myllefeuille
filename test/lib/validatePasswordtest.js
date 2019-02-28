var assert = require('assert');
var validatePassword = require('../../lib/validatePassword');

describe('ngram', function() {
  describe('validate()', function() {
    it('should return true when successfully validated', function() {
      assert.strictEqual(validatePassword.validate("Ab$de123"), true);
    });
  });

  describe('validate()', function() {
    it('should return false', function() {
      assert.strictEqual(validatePassword.validate("ab$de123"), false);
    });
  });

  describe('validate()', function() {
    it('should return false', function() {
      assert.strictEqual(validatePassword.validate("AB$DE123"), false);
    });
  });

  describe('validate()', function() {
    it('should return false', function() {
      assert.strictEqual(validatePassword.validate("Ab$defgh"), false);
    });
  });

  describe('validate()', function() {
    it('should return false', function() {
      assert.strictEqual(validatePassword.validate("Ab$de12"), false);
    });
  });

  describe('validate()', function() {
    it('should return false', function() {
      assert.strictEqual(validatePassword.validate("Abcde123"), false);
    });
  });

  describe('validate()', function() {
    it('should return false', function() {
      assert.strictEqual(validatePassword.validate("Ab$de 123"), false);
    });
  });

});
