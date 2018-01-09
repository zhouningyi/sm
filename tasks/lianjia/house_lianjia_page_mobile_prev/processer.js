/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var _ = require('lodash');

var UtilsLianjia = require('./../../../utils/lianjia');
module.exports = function(record, success, fail) {
  var $ = record.$;
  var Models = record.models;
  var json = record.json;
  if (!json) return fail();
  var n = json.data.total_count;
  var d = record.params;
  var url = record.url;
  if(url.indexOf('zufang') !== -1){
    d.renting_count = n;
  } else if(url.indexOf('ershoufang') !== -1){
    console.log(url)
    d.selling_count = n;
  }
  console.log(d);

  Models.seed_lianjia_mobile.upsert(d).then(function(){
    return success();
  });
};