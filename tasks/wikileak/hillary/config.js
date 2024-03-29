/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const fs = require('fs');
const path = require('path');

const getURL = (n) => {
  const count = 200;
  return `https://wikileaks.org/clinton-emails/?q=&mfrom=&mto=&title=&notitle=&date_from=&date_to=&nofrom=&noto=&count=${count}&sort=2&page=${n}&#searchresult`;
};

module.exports = {
  name: 'hillary',
  version: 2,
  desc: '希拉里邮件门',
  time: {
    type: 'interval',
    value: 1
  },
  urls: (cb) => {
    const urls = {};
    for (let i = 0; i < 155; i++) {
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
  models: ['hillary'],
  periodInterval: 200,
  printInterval: 5
};
