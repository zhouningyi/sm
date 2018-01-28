/**
 *处理方法
 */
let Utils = require('./../../../../lib/utils');
let fs = require('fs');
let path = require('path')

module.exports = function(record, success, fail) {
  let $ = record.$
  let model = record.models.podestas
  let mailid = record.params.mailid
  let content = $('#content').find('.email-content').text()
  model.upsert({
    mailid: mailid,
    content: content
  }).then((e) => '')
  return success(null);
}