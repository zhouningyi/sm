/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const fs = require('fs');
const path = require('path');
const Models = require('./../../../../model');

const getURL = (text) => {
  return `https://wikileaks.org/podesta-emails/${text}`;
};

module.exports = {
  version: 2,
  name: 'podesta_detail',
  desc: 'podesta邮件门正文',
  time: {
    type: 'interval',
    value: 10
  },
  urls: (cb) => {
    const urls = {};
    Models.sequelize.query(`
      SELECT mailid 
      FROM podestas 
      WHERE "content" IS NULL
    `).then((ds) => {
      ds = ds[0];
      const urls = {};
      ds.forEach((d) => {
        const mailid = d.mailid;
        const url = getURL(mailid);
        urls[url] = {
          url,
          params: {
            mailid
          }
        };
      });
      cb(urls);
    });
  },
  parseType: 'dom',
  processing: require('./processor'),
  parallN: 15,
  queryInterval: 0,
  proxy: 'shadow',
  models: ['podestas'],
  periodInterval: 200,
  printInterval: 5
};
