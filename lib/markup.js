exports.getMarkedUpText = function(text){
  var str = text;
  var result = '';
  var next, next2, tmp;

  while(1) {
    next = str.search('{{{');
    if (next === -1) {
      result += splitCode(str);
      return result;
    }
    result += escapeAndReplaceReturn(str.slice(0, next));
    str = str.slice(next + 3); // 3 = length of '{{{'
    next2 = str.search('}}}');
    if (next2 === -1) {
      result += str;
      return result;
    }
    result += str.slice(0, next2);
    str = str.slice(next2 + 3); // 3 = length of '}}}'
  }
}

function splitCode(text){
  var str = text;
  var result = '';
  var isInNotMarkupBrackets = false;
  var next, next2, tmp, tmp2;

  while(1) {
    next = str.search('~');
    if (next === -1) {
      tmp = escapeAndReplaceReturn(str);
      result += markup(tmp);
      return result;
    }
    tmp = escapeAndReplaceReturn(str.slice(0, next));
    tmp2 = markup(tmp);
    result += tmp2 + '<pre><code>';
    str = str.slice(next + 1); // 1 = length of '~'
    next2 = str.search('~');
    if (next2 === -1) {
      result += str + '</code></pre>';
      return result;
    }
    result += str.slice(0, next2) + '</code></pre>';
    str = str.slice(next2 + 1); // 1 = length of '~'
  }
}

function escapeAndReplaceReturn(text){
  return escape(text).replace(/\r?\n|\r/g,'<br>');
}

function escape(text){
  var escapeMap = { '&':'&amp;', '\'':'&#39;', '"':'&quot;', '<':'&lt;', '>':'&gt;'};
  return text.replace(/[&"'<>]/g,function(c){return escapeMap.hasOwnProperty(c)?escapeMap[c]:c});
}

function markup(text){
  str = markupBold(text);
  str = markupItalic(str);
  str = markupUl(str);
  str = markupOl(str);
  str = markupH3(str);
  str = markupH2(str);
  str = removeBrBeforeUl(str);
  str = removeBrBeforeOl(str);
  str = removeBrAfterH3(str);
  str = removeBrAfterH2(str);
  str = markupA(str); // and escape other than <a href='string'>
  return str;
}

function markupBold(text){
  var str = text;
  var result = '';
  var isIn = false;
  var next, next2, tmp, tmp2;

  while(1) {
    next = str.search(/\*\*/);
    if (next === -1) {
      result += str;
      if (isIn){
        result += '</b>';
      }
      return result;
    }
    tmp = str.slice(0, next);
    if (isIn){
      tmp2 = tmp + '</b>';
    } else {
      tmp2 = tmp + '<b>';
    }
    result += tmp2;
    str = str.slice(next + 2); // 2 = length of '**'
    isIn = !isIn;
  }
}

function markupItalic(text){
  var str = text;
  var result = '';
  var isIn = false;
  var next, next2, tmp, tmp2;

  while(1) {
    next = str.search(/\_/);
    if (next === -1) {
      result += str;
      if (isIn){
        result += '</i>';
      }
      return result;
    }
    tmp = str.slice(0, next);
    if (isIn){
      tmp2 = tmp + '</i>';
    } else {
      tmp2 = tmp + '<i>';
    }
    result += tmp2;
    str = str.slice(next + 1); // 1 = length of '_'
    isIn = !isIn;
  }
}

function markupH3(text){
  var str = text;
  var result = '';
  var next, next2, tmp;

  while(1) {
    next = str.search(/###[^\S\r\n]/);
    if (next === -1) {
      result += str;
      return result;
    }
    tmp = str.slice(0, next);
    result += tmp + '<h3>';
    str = str.slice(next + 4); // 4 = length of '### '
    next2 = str.search('<br>'); // already replaced in escapeAndReplaceReturn
    if (next2 === -1) {
      result += str + '</h3>';
      return result;
    }
    result += str.slice(0, next2) + '</h3>';
    str = str.slice(next2);
  }
}

function markupH2(text){
  var str = text;
  var result = '';
  var next, next2, tmp;

  while(1) {
    next = str.search(/##[^\S\r\n]/);
    if (next === -1) {
      result += str;
      return result;
    }
    tmp = str.slice(0, next);
    result += tmp + '<h2>';
    str = str.slice(next + 3); // 3 = length of '## '
    next2 = str.search('<br>'); // already replaced in escapeAndReplaceReturn
    if (next2 === -1) {
      result += str + '</h2>';
      return result;
    }
    result += str.slice(0, next2) + '</h2>';
    str = str.slice(next2 + 4);
  }
}

function removeBrAfterH3(text){
  return replaceAll(text, '</h3><br>', '</h3>');
}

function removeBrAfterH2(text){
  return replaceAll(text, '</h2><br>', '</h2>');
}

function replaceAll(str, before, after) {
    return str.split(before).join(after);
};

function markupUl(text){
  var str = text;
  var result = '';
  var isIn = false;
  var next, next2, tmp;

  while(1) {
    if (!isIn) {
      next = str.search(/[^\S\r\n]*\*[^\S\r\n]/);
    } else {
      next = str.search(/^[^\S\r\n]*\*[^\S\r\n]/);
    }
    if (next === -1) {
      if (!isIn) {
        result += str;
        return result;
      } else {
        result += '</ul>';
        isIn = !isIn;
        continue;
      }
    }
    if (!isIn) {
      result += str.slice(0, next) + '<ul>';
      str = str.slice(next);
      isIn = !isIn;
    }
    result += '<li>';
    tmp = str.match(/^[^\S\r\n]*\*[^\S\r\n]/);
    if (tmp !== null) {
      str = str.slice(tmp[0].length);
    }
    next2 = str.search('<br>'); // already replaced in escapeAndReplaceReturn
    if (next2 === -1) {
      result += str + '</li>';
      str = '';
    } else {
      result += str.slice(0, next2) + '</li>';
      str = str.slice(next2 + 4); // 4 = length of '<br>'
    }
  }
}

function markupOl(text){
  var str = text;
  var result = '';
  var isIn = false;
  var next, next2, tmp;

  while(1) {
    if (!isIn) {
      next = str.search(/[^\S\r\n]*1\.[^\S\r\n]/);
    } else {
      next = str.search(/^[^\S\r\n]*1\.[^\S\r\n]/);
    }
    if (next === -1) {
      if (!isIn) {
        result += str;
        return result;
      } else {
        result += '</ol>';
        isIn = !isIn;
        continue;
      }
    }
    if (!isIn) {
      result += str.slice(0, next) + '<ol>';
      str = str.slice(next);
      isIn = !isIn;
    }
    result += '<li>';
    tmp = str.match(/^[^\S\r\n]*1\.[^\S\r\n]/);
    if (tmp !== null) {
      str = str.slice(tmp[0].length);
    }
    next2 = str.search('<br>'); // already replaced in escapeAndReplaceReturn
    if (next2 === -1) {
      result += str + '</li>';
      str = '';
    } else {
      result += str.slice(0, next2) + '</li>';
      str = str.slice(next2 + 4); // 4 = length of '<br>'
    }
  }
}

function removeBrBeforeUl(text){
  return replaceAll(text, '<br><ul>', '<ul>');
}
function removeBrBeforeOl(text){
  return replaceAll(text, '<br><ol>', '<ol>');
}

function markupA(text){
  var str = text;
  var result = '';
  var isIn = false;
  var re = /\[(.+)\]\((.+)\)/;
  var next, next2, tmp, tmp2;
  var linktext, linkuri;

  while(1) {
    next = str.search(re);
    if (next === -1) {
      result += str;
      return result;
    }
    result += str.slice(0, next);
    str = str.slice(next);
    tmp = str.match(re);
    if (tmp !== null) {
      tmp2 = tmp[0];
      linktext = tmp2.replace(re, '$1');
      linkuri = tmp2.replace(re, '$2');
      // linktext is already replaced in escapeAndReplaceReturn
      linkuri = sanitizeUri(linkuri);
    } else {
      tmp2 = '';
      linktext = '';
      linkuri = '';
    }
    result += "<a href='" + linkuri + "'>" + linktext + "</a>";
    str = str.slice(tmp2.length);
  }
}

// sanitizeUri
// algorithm mainly from https://www.ipa.go.jp/security/awareness/vendor/programmingv1/a01_02_main.html with some modification
function sanitizeUri(text) {
    var scheme = '';
    var allowed = false;
    console.log("sanitizeUri: before=" + text);

    // revert over-escaped &amp; in escapeAndReplaceReturn
    var uri = replaceAll(text, '&amp;', '&');

    // return '' if not allowed character is detected
    // --- http://www.ietf.org/rfc/rfc2396.txt ---
    // uric = reserved | unreserved | escaped
    // reserved = ";" | "/" | "?" | ":" | "@" | "&" | "=" | "+" | "$" | ","
    // unreserved = alphanum | mark
    // mark = "-" | "_" | "." | "!" | "~" | "*" | "'" | "(" | ")"
    // escaped = "%" hex hex

    if (uri.match(/[^;/?:@&=+\$,A-Za-z0-9\-_\.!~\*'\(\)\%]/)) {
      console.log("sanitizeUri: invalid character");
      return '';
    }

    // return ''if the scheme is not allowed
    // --- http://www.ietf.org/rfc/rfc2396.txt ---
    // scheme = alpha *( alpha | digit | "+" | "-" | "." )
    if (uri.match(/^([A-Za-z][A-Za-z0-9+\-.]*):/)) {
      scheme = RegExp.$1;
      scheme = scheme.toLowerCase();
    }
    if (!scheme) { allowed = true; }  // allowed against ipa.go.jp algorithm
    if (scheme === 'http') { allowed = true; }
    if (scheme === 'https') { allowed = true; }
    if (scheme === 'mailto') { allowed = true; }
    if (!allowed) {
      console.log("sanitizeUri: invalid scheme");
      return '';
    }

    // HTML escape
    // special = "&" | "<" | ">" | '"' | "'"
    // URI allowed characters only, so "<"，">"，'"' are already not exist
    // & is allowed, against ipa.go.jp algorithm
    uri = replaceAll(uri, "'", '&#39;');

    console.log("sanitizeUri: after=" + uri);
    return uri;
}

