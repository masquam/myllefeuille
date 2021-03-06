exports.getNgramText = function(text){
  var ngr = 2;
  var ngramText = "";
  if (text === null)
  {
    return "";
  }
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
  if (text === null)
  {
    return "";
  }
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

exports.getNgramTextSpaceSeparated = function(text){
  var ngramText = "";
  var ngramTextSpaceSeparated = "";
  if (text === null)
  {
    console.log("getNgramTextSpaceSeparated: null");
    return "";
  }
  if (text === "")
  {
    console.log("getNgramTextSpaceSeparated: empty");
    return "";
  }
  var words = text.split(/\s/);
  for (var i = 0, len = words.length; i < len; i++) {
      ngramText += "\"" + getNgramTextForSearch(words[i]) + "\"";
      ngramText += " ";
  }
  ngramTextSpaceSeparated = ngramText.trimEnd();
  console.log("getNgramTextSpaceSeparated = " + ngramTextSpaceSeparated);
  return ngramTextSpaceSeparated;
}
