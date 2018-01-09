/**
 *处理方法
 */
let Utils = require('./../../../../lib/utils');
let fs = require('fs');
let path = require('path')

module.exports = function(record, success, fail) {
  let $ = record.$
  let model = record.models.dnc
  let resultNode = $('#searchresult').find('tbody')
  let title, from, to, href, a
  resultNode.find('tr').each((i, node) => {
      node = $(node)
      href = node.children().eq(0).find('a').attr('href')
      mailid = node.children().eq(0).find('a').text()
      date = node.children().eq(1).text()
      date = new Date(date)
      title = node.children().eq(2).text()
      from = node.children().eq(3).text()
      from = Utils.trim(from)
      to = node.children().eq(4).text()
      if (!to) return
      to = Utils.trim(to)
      if (!to) return
      to = to.split(',')
      d = {
        time: date,
        title: title,
        from: from,
        to: to,
        href: href,
        mailid: mailid
      }
      model.upsert(d).then(() => {})
    });
  return success(null);
}