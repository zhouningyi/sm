/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const fs = require('fs')
const path = require('path')
const Models = require('./../../../../model')

const getURL = (text) => {
  return `https://wikileaks.org/dnc-emails/emailid/${text}`
}

module.exports = {
  version: 2,
  name: 'dnc_detail',
  desc: 'dnc邮件门正文',
  time: {
    type: 'interval',
    value: 10
  },
  urls: (cb) => {
    let urls = {}
    Models.sequelize.query(`
      SELECT mailid 
      FROM dncs 
      WHERE "content" IS NULL
    `).then((ds) => {
      ds = ds[0]
      let urls = {}
      ds.forEach((d) => {
        let mailid = d.mailid
        let url = getURL(mailid)
        urls[url] = {
          url: url,
          params: {
            mailid: mailid
          }
        }
      })
      cb(urls)
    })
  },
  parseType: 'dom',
  processing: require('./processer'),
  parallN: 15,
  queryInterval: 0,
  proxy: 'shadow',
  models: ['dnc'],
  periodInterval: 200,
  printInterval: 5
}
