exports.getMarkedUpText = function(text){
/*
  var escapeMap = {'&':'&amp;', '\'':'&#39;', '"':'&quot;', '<':'&lt;', '>':'&gt;'};
  return text.replace(/[&"'<>]/g,function(c){return escapeMap.hasOwnProperty(c)?escapeMap[c]:c}).replace(/\r?\n|\r/g,"<br>");
*/
  var str = text;
  var result = '';
  var isInNotMarkupBrackets = false;
  var next, next2, tmp, tmp2;

  while(1) {
    // find '{{code}}'
    next = str.search('{{code}}');

    // if not found, escape and replace \n to all the string
    if (next === -1) {
      tmp = escapeAndReplaceReturn(str);
      tmp2 = markup(tmp, isInNotMarkupBrackets);
      result += tmp2;
      return result;
    }

    // if found, escape and replace \n to the string
    tmp = escapeAndReplaceReturn(str.slice(0, next));
    tmp2 = markup(tmp, isInNotMarkupBrackets);
    result += tmp2 + '<pre><code>';
    str = str.slice(next + 8); // 8 = length of '{{code}}'

    // find '{{/code}}'
    next2 = str.search('{{/code}}');

    // if not found, all the string as code
    // if found, the string as code
    if (next2 === -1) {
      result += str + '</code></pre>';
      str = '';
    } else {
      result += str.slice(0, next2) + '</code></pre>';
      str = str.slice(next2 + 9); // 9 = length of '{{/code}}'
      console.log(str);
    }
  }
}

function escapeAndReplaceReturn(text){
  var escapeMap = {'&':'&amp;', '\'':'&#39;', '"':'&quot;', '<':'&lt;', '>':'&gt;'};
  return text.replace(/[&"'<>]/g,function(c){return escapeMap.hasOwnProperty(c)?escapeMap[c]:c}).replace(/\r?\n|\r/g,"<br>");
}

function markup(text, isInNotMarkupBrackets){
  var str = text;
  var result = '';
  var searchstr, next, tmp;

  while(1){
    if (isInNotMarkupBrackets) {
      searchstr = '}}}';
    } else {
      searchstr = '{{{';
    }
    next = str.search(searchstr);
    if (next === -1) {
      tmp = str;
      if (!isInNotMarkupBrackets){
        tmp = markupString(tmp);
      }
      result += tmp;
      return result;
    }

    tmp = str.slice(0, next);
    if (!isInNotMarkupBrackets){
        tmp = markupString(tmp);
    }
    result += tmp;
    str = str.slice(next + 3); // 3 = length of searchstr
    isInNotMarkupBrackets = !isInNotMarkupBrackets;
  }

}

function markupString(text){
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
    str = str.slice(next + 2); // 8 = length of '**'
    isInBold = !isInBold;
  }
}

