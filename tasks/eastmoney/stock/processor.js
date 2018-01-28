/**
 *处理方法
 */
let Utils = require('./../../../../lib/utils');
let fs = require('fs');
let path = require('path')

module.exports = function(record, success, fail) {
  const {strock, strock_statu_day}= record.model;
  return success(null);
  // return fail();
}