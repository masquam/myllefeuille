var express = require('express');
var mongoose = require('mongoose');
var models = require('../models');

/**
 * search knowledge list
 *
 *
 * @param res response object (pass through to callback)
 * @param {string} searchstring search string
 * @param {number} limit upper limit value of selected list
 * @param {number} skip skip value of selected list
 * @param callback callback function(err, res, searchstring, listKnowledge)
 */
exports.getList = function(res, searchstring, limit, skip, callback){
  console.log('searchKnowledgeList.js searchKnowledgeList start');
  var KnowledgeFTS = models('KnowledgeFTS');
  KnowledgeFTS
    .find(
        { $text : { $search : searchstring } }, 
        { score : { $meta: "textScore" } }
    )
    .sort({ score : { $meta : 'textScore' } })
    .skip(skip)
    .limit(limit)
    .exec(function (err, docs) {
      if (err) {
        console.log('searchKnowledgeList.js FTS find error');
        next(err);
      }
      ftsToKnowledges(err, docs, res, searchstring, callback);
    });
}

function ftsToKnowledges(err, docs, res, searchstring, callback){
  var docsIdArray = [];
  for (var i = 0, len = docs.length; i < len; i++) {
    docsIdArray.push(docs[i].id);
  }
  console.log(docsIdArray);
  var Knowledge = models('Knowledge');
  Knowledge.find(
    {'id': { $in: docsIdArray}},
    '_id id title content_summary author accesscount like',
    function (err, listKnowledge) {
      if (err) {
        console.log('searchKnowledgeList.js Knowledge find error');
        next(err);
      }
      callback(err, res, searchstring, listKnowledge);
    });
}
