var assert = require('assert');
var ngram = require('../../lib/ngram');

describe('ngram', function() {
  describe('getNgramText()', function() {
    it('should return "" when the value is ""', function() {
      assert.strictEqual(ngram.getNgramText(""), "");
    });
  });

  describe('getNgramText()', function() {
    it('should return "" when the value is null', function() {
      assert.strictEqual(ngram.getNgramText(null), "");
    });
  });

  describe('getNgramText()', function() {
    it('should return the string value with just one character when the value is their character', function() {
      assert.strictEqual(ngram.getNgramText("a"), "a");
    });
  });

  describe('getNgramText()', function() {
    it('should return the string value with just two characters when the value is their characters', function() {
      assert.strictEqual(ngram.getNgramText("ab"), "ab");
    });
  });

  describe('getNgramText()', function() {
    it('should return the string value with divided two characters when the value is three characters', function() {
      assert.strictEqual(ngram.getNgramText("abc"), "ab bc");
    });
  });

  describe('getNgramText()', function() {
    it('should return the string value with divided two characters when the value is four characters', function() {
      assert.strictEqual(ngram.getNgramText("abcd"), "ab bc cd");
    });
  });

  describe('getNgramTextSpaceSeparated()', function() {
    it('should return "" when the value is ""', function() {
      assert.strictEqual(ngram.getNgramTextSpaceSeparated(""), "");
    });
  });

  describe('getNgramTextSpaceSeparated()', function() {
    it('should return "" when the value is null', function() {
      assert.strictEqual(ngram.getNgramTextSpaceSeparated(null), "");
    });
  });

  describe('getNgramTextSpaceSeparated()', function() {
    it('should return the just one character plus asterisk when the value is just one character', function() {
      assert.strictEqual(ngram.getNgramTextSpaceSeparated("a"), "a*");
    });
  });

  describe('getNgramTextSpaceSeparated()', function() {
    it('should return the string value with just two characters when the value is their characters', function() {
      assert.strictEqual(ngram.getNgramTextSpaceSeparated("ab"), "ab");
    });
  });

  describe('getNgramTextSpaceSeparated()', function() {
    it('should return the string value with divided two characters when the value is three characters', function() {
      assert.strictEqual(ngram.getNgramTextSpaceSeparated("abc"), "ab bc");
    });
  });

  describe('getNgramTextSpaceSeparated()', function() {
    it('should return the string value with divided two characters when the value is four characters', function() {
      assert.strictEqual(ngram.getNgramTextSpaceSeparated("abcd"), "ab bc cd");
    });
  });

  describe('getNgramTextSpaceSeparated()', function() {
    it('should return the string value with separated two characters when the value is space-separated characters', function() {
      assert.strictEqual(ngram.getNgramTextSpaceSeparated("ab cd"), "ab cd");
    });
  });

  describe('getNgramTextSpaceSeparated()', function() {
    it('should return the string value with separated two characters when the value is space-separated characters', function() {
      assert.strictEqual(ngram.getNgramTextSpaceSeparated("abc de"), "ab bc de");
    });
  });

});
