/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Utils = require('./../../../lib/utils');
const { bcoin_user } = require('./../exchanges/schemas');
const meta = require('./meta');

module.exports = {
  name: 'bcoins',
  desc: 'bcoins',
  time: {
    value: 10,
    type: 'interval'
  },
  headers: {
    token: 'a5f55a6f410634dba0ae19ce8cebb1d6',
    Host: 'blz.bicoin.com.cn',
  },
  urls: (cb, db_id) => {
    const urls = {};
    for (const i in meta) {
      const params = meta[i];
      const url = `https://blz.bicoin.com.cn/firmOffer/getUserAccountInfo?userId=${params.id}`;
      urls[url] = { url, params };
    }
    cb(urls);
  },
  parseType: 'json',
  periodInterval: 1000,
  models: [bcoin_user],
  printInterval: 30,
  //
  parallN: 1,
};
