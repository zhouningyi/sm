/**
 * 爬取配置
 */
const _ = require('lodash');
// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'aicoin_quicknews',
  desc: 'aicoin的信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    const urls = {};
    const pageSize = 10;
    _.range(0, 50000, pageSize).reverse().forEach((idx) => {
      const url = `https://www.aicoin.net.cn/api/data/moreFlash?pagesize=${pageSize}&lastid=${idx}`;
      urls[url] = { url };
    });
    cb(urls);
  },
  parseType: 'json',
  periodInterval: 1000,
  models: ['aicoin_quicknews'],
  // tables: ['aicoin_quicknews'],
  printInterval: 30,
  //
  parallN: 3,
};
