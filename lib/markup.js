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
  var escapeMap = {'&':'&amp;', '\'':'&#39;', '"':'&quot;', '<':'&lt;', '>':'&gt;'};
  return text.replace(/[&"'<>]/g,function(c){return escapeMap.hasOwnProperty(c)?escapeMap[c]:c}).replace(/\r?\n|\r/g,"<br>");
}

function markup(text){
  text = markupBold(text);
  return text;
}

function markupBold(text){
  var str = text;
  var result = '';
  var isInBold = false;
  var next, next2, tmp, tmp2;

  while(1) {
    next = str.search(/\*\*/);
    if (next === -1) {
      result += str;
      if (isInBold){
        result += '</b>';
      }
      return result;
    }
    tmp = str.slice(0, next);
    if (isInBold){
      tmp2 = tmp + '</b>';
    } else {
      tmp2 = tmp + '<b>';
    }
    result += tmp2;
    str = str.slice(next + 2); // 2 = length of '**'
    isInBold = !isInBold;
  }
}

