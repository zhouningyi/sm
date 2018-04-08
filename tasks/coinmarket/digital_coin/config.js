/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'digital_coin',
  desc: '比特币信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    const urls = {};
    const urlList = ['https://coinmarketcap.com/coins/views/all/', 'https://coinmarketcap.com/tokens/views/all/'];
    _.forEach(urlList, (url) => {
      urls[url] = { url };
    });
    cb(urls);
  },
  parseType: 'dom',
  periodInterval: 1000,
  tables: ['digital_coin'],
  printInterval: 30,
  proxy: 'shadow',
  //
  parallN: 1,
};
