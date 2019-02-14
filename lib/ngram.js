exports.getNgramText = function(text){
  var ngr = 2;
  var ngramText = "";
  var length = text.length;
  if (length < 1)
  {
    return "";
  }
  if (length > ngr)
  {
    var index = length - ngr;
    for (i = 0; i < index; i++)
    {
      ngramText += text.substring(i, i + ngr);
      ngramText += " ";
      if (i == (index - 1))
      {
        i++;
        ngramText += text.substring(i, i + ngr);
        if (i % ngr >= ngr)
        {
          i++;
          ngramText += " ";
          ngramText += text.substring(i, i + ngr);
        }
      }
    }
  }
  else
  {
      ngramText += text;
  }
  return ngramText;
}

function getNgramTextForSearch(text){
  var ngr = 2;
  var ngramText = "";
  var length = text.length;
  if (length < 1)
  {
    return "";
  }
  if (length > ngr)
  {
    var index = length - ngr;
    for (i = 0; i < index; i++)
    {
      ngramText += text.substring(i, i + ngr);
      ngramText += " ";
      if (i == (index - 1))
      {
        i++;
        ngramText += text.substring(i, i + ngr);
        if (i % ngr >= ngr)
        {
          i++;
          ngramText += " ";
          ngramText += text.substring(i, i + ngr);
        }
      }
    }
  }
  else
  {
      ngramText += text + "*";
  }
  return ngramText;
}

exports.getNgramTextSpaceSeparated = function(text){
  var ngramText = "";
  var words = text.split(/\s/);
  console.log("before");
  //words,forEach(function(word) {
  for (var i = 0, len = words.length; i < len; i++) {
      console.log("after");
      ngramText += getNgramTextForSearch(words[i]);
      ngramText += " ";
  }
  return ngramText.trimEnd();
}
