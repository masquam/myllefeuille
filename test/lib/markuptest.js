var assert = require('assert');
var markup = require('../../lib/markup');

describe('markup', function() {
  describe('getMarkedUpText()', function() {
    it('should return "" when the value is ""', function() {
      assert.strictEqual(markup.getMarkedUpText(""), "");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<b>bold</b>" when the value is "**bold**"', function() {
      assert.strictEqual(markup.getMarkedUpText("**bold****bold**done"), "<b>bold</b><b>bold</b>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<i>italic</i>" when the value is "_italic_"', function() {
      assert.strictEqual(markup.getMarkedUpText("_italic__italic_done"), "<i>italic</i><i>italic</i>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<ul><li></li></ul>" when the value starts with "* " 1', function() {
      assert.strictEqual(markup.getMarkedUpText("* 1st\n* 2nd\ndone"), "<ul><li>1st</li><li>2nd</li></ul>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<ul><li></li></ul>" when the value starts with "* " 2', function() {
      assert.strictEqual(markup.getMarkedUpText("start* 1st\n* 2nd"), "start<ul><li>1st</li><li>2nd</li></ul>");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<ul><li></li></ul>" when the value starts with "* " 3', function() {
      assert.strictEqual(markup.getMarkedUpText("start* 1st\n* 2nd\nsecond\n *\u30001st\n  * 2nd\ndone"), "start<ul><li>1st</li><li>2nd</li></ul>second<ul><li>1st</li><li>2nd</li></ul>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<ol><li></li></ol>" when the value starts with "1. " 1', function() {
      assert.strictEqual(markup.getMarkedUpText("1. 1st\n1. 2nd\ndone"), "<ol><li>1st</li><li>2nd</li></ol>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<ol><li></li></ol>" when the value starts with "1. " 2', function() {
      assert.strictEqual(markup.getMarkedUpText("start1. 1st\n1. 2nd"), "start<ol><li>1st</li><li>2nd</li></ol>");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<ol><li></li></ol>" when the value starts with "* " 3', function() {
      assert.strictEqual(markup.getMarkedUpText("start1. 1st\n1. 2nd\nsecond\n 1.\u30001st\n  1. 2nd\ndone"), "start<ol><li>1st</li><li>2nd</li></ol>second<ol><li>1st</li><li>2nd</li></ol>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<h3>" when the value starts with "### " 1', function() {
      assert.strictEqual(markup.getMarkedUpText("### title"), "<h3>title</h3>");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<h3>" when the value starts with "### " 2', function() {
      assert.strictEqual(markup.getMarkedUpText("start### title\nsecond\n### title2\ndone"), "start<h3>title</h3>second<br><h3>title2</h3>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<h2>" when the value starts with "## " 1', function() {
      assert.strictEqual(markup.getMarkedUpText("## title"), "<h2>title</h2>");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "<h2>" when the value starts with "## " 2', function() {
      assert.strictEqual(markup.getMarkedUpText("start## title\ndone"), "start<h2>title</h2>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return "##" with "{{{}}}"', function() {
      assert.strictEqual(markup.getMarkedUpText("start{{{## title}}}\ndone"), "start## title<br>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return <a> 1', function() {
      assert.strictEqual(markup.getMarkedUpText("start[link](http://localhost:3000/1.html)done"), "start<a href='http://localhost:3000/1.html'>link</a>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return <a> 2', function() {
      assert.strictEqual(markup.getMarkedUpText("start[link](1.html)done"), "start<a href='1.html'>link</a>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return <a> 3 - invalid scheme', function() {
      assert.strictEqual(markup.getMarkedUpText("start[link](javascript:alert('oops'))done"), "start<a href=''>link</a>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return <a> 4 - linkstring escape', function() {
      assert.strictEqual(markup.getMarkedUpText("start[<b>link</b>](1.html)done"), "start<a href='1.html'>&lt;b&gt;link&lt;/b&gt;</a>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return <a> 5 - includes &', function() {
      assert.strictEqual(markup.getMarkedUpText("start[link](1.html?a=1&b=2)done"), "start<a href='1.html?a=1&b=2'>link</a>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it("should return <a> 6 - includes '", function() {
      assert.strictEqual(markup.getMarkedUpText("start[link](1.html?a='&b=2)done"), "start<a href='1.html?a=&#39;&b=2'>link</a>done");
    });
  });

  describe('getMarkedUpText()', function() {
    it('should return <a> 7 - double', function() {
      assert.strictEqual(markup.getMarkedUpText("start[link](http://localhost:3000/1.html)donestart[link](http://localhost:3000/1.html)done"), "start<a href='http://localhost:3000/1.html'>link</a>donestart<a href='http://localhost:3000/1.html'>link</a>done");
    });
  });
});
