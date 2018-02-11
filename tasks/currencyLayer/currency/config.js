/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'currency',
  desc: '汇率信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb) => {
    const url = 'http://apilayer.net/api/live?access_key=f832fd62f43392cd9d507ee3c38597dd';
    const result = {};
    result[url] = { url };
    result[`${url}`] = { url };
    cb(result);
  },
  parseType: 'json',
  periodInterval: 1000,
  tables: ['curreny'],
  printInterval: 30,
  //
  parallN: 1,
};
