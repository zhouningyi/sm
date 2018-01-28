/**
 *处理方法
 */
let Utils = require('./../../../../lib/utils');
let fs = require('fs');
let path = require('path')

module.exports = function(record, success, fail) {
  let $ = record.$
  let model = record.models.podestas
  let resultNode = $('#searchresult').find('tbody')
  let title, from, to, href, a
  resultNode.find('tr').each((i, node) => {
    node = $(node)
    if(i % 2 === 0){//subtitle
      a = node.find('a')
      title = a.text()
      href = a.attr('href')
    } else {
      date = node.children().eq(0).text()
      date = new Date(date)
      from = node.children().eq(2).text()
      from = Utils.trim(from)
      to = node.children().eq(3).text()
      if(!to) return
      to = Utils.trim(to)
      if(!to) return
      to = to.split(',')
      d = {
        time: date,
        title: title,
        from: from,
        to: to,
        href: href,
        mailid: href
      }
      // console.log(d)
      model.upsert(d).then(() => {})
    }
  })
  return success(null);
}