/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const fs = require('fs');
const path = require('path');

const getURL = (n) => {
  const count = 200;
  return `https://wikileaks.org/dnc-emails/?q=&mfrom=&mto=&title=&notitle=&date_from=&date_to=&nofrom=&noto=&count=${count}&sort=2&page=${n}&#searchresult`;
};

module.exports = {
  name: 'dnc',
  version: 2,
  desc: 'dnc邮件门',
  time: {
    type: 'interval',
    value: 1
  },
  urls: (cb) => {
    const urls = {};
    for (let i = 0; i < 138; i++) {
      const url = getURL(i);
      urls[url] = {
        url
      };
    }
    cb(urls);
  },
  parseType: 'dom',
  processing: require('./processor'),
  parallN: 10,
  proxy: 'shadow',
  queryInterval: 0,
  models: ['dnc'],
  periodInterval: 200,
  printInterval: 5
};
