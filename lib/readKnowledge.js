var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var models = require('../models');

/**
 * read knowledge
 *
 *
 * @param res response object (pass through to callback)
 * @param {number} id id number
 * @param callback callback function(err, res, id, knowledge, knowledgeContent)
 */
exports.read = function(res, id, callback){
  console.log('readKnowledge.js read start');
  var Knowledge = models('Knowledge');
  Knowledge.findOne({ id: id })
    .exec(function (err, knowledge) {
      if (err || knowledge == null) {
        console.log('readKnowledge.js Knowledge find error');
        callback(createError(404), res, id, null, null);
      } else {
      var KnowledgeContents = models('KnowledgeContents');
      KnowledgeContents.findOne({ id: id })
        .exec(function (err, knowledgeContent) {
          if (err || knowledgeContent == null) {
            console.log('readKnowledge.js knowledgeContent find error');
            callback(createError(404), res, id, null, null);
          } else {
            callback(null, res, id, knowledge, knowledgeContent);
          }
        });
      }
    });


}

