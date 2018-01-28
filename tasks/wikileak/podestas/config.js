/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const fs = require('fs');
const path = require('path');

const getURL = (n) => {
  const count = 200;
  return `https://wikileaks.org/podesta-emails/?q=&mfrom=&mto=&title=&notitle=&date_from=&date_to=&nofrom=&noto=&count=${count}&sort=6&page=${n}`;
};

module.exports = {
  name: 'podestas',
  version: 2,
  desc: 'podesta邮件门',
  time: {
    type: 'interval',
    value: 0.1
  },
  urls: (cb) => {
    const urls = {};
    for (let i = 0; i < 294; i++) {
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
  models: ['podestas'],
  periodInterval: 200,
  printInterval: 5
};
