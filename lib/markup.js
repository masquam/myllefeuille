exports.getMarkedUpText = function(text){
/*
  var escapeMap = {'&':'&amp;', '\'':'&#39;', '"':'&quot;', '<':'&lt;', '>':'&gt;'};
  return text.replace(/[&"'<>]/g,function(c){return escapeMap.hasOwnProperty(c)?escapeMap[c]:c}).replace(/\r?\n|\r/g,"<br>");
*/
  var next, next2;
  var result = '';
  var str = text;

  while(1) {
    // find '{{code}}'
    next = str.search('{{code}}');

    // if not found, escape and replace \n to all the string
    if (next === -1) {
      result += escapeAndReplaceReturn(str);
      return result;
    }

    // if found, escape and replace \n to the string
    result += escapeAndReplaceReturn(str.slice(0, next)) + '<pre><code>';
    str = str.slice(next + 8); // 8 = length of '{{code}}'
    console.log(str);
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
