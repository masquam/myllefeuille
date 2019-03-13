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
  str = markupBold(text);
  str = markupItalic(str);
  str = markupH3(str);
  str = markupH2(str);
  str = removeBrAfterH3(str);
  str = removeBrAfterH2(str);
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
  var isIn = false;
  var next, next2, tmp, tmp2;

  while(1) {
    next = str.search('### ');
    if (next === -1) {
      result += str;
      return result;
    }
    tmp = str.slice(0, next);
    result += tmp + '<h3>';
    str = str.slice(next + 4); // 1 = length of '### '
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
  var isIn = false;
  var next, next2, tmp, tmp2;

  while(1) {
    next = str.search('## ');
    if (next === -1) {
      result += str;
      return result;
    }
    tmp = str.slice(0, next);
    result += tmp + '<h2>';
    str = str.slice(next + 3); // 1 = length of '## '
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
  return text.replace('</h3><br>', '</h3>');
}
function removeBrAfterH2(text){
  return text.replace('</h2><br>', '</h2>');
}


