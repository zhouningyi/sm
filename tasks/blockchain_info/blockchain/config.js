/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'blockchain',
  desc: '比特币转账信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    const url = 'https://blockchain.info/address/';
    const token = '1N52wHoVR79PMDishab2XmRHsbekCdGquK';
    const result = {};
    result[url] = { url };
    result[`${url}_`] = { url };
    cb(result);
  },
  parseType: 'dom',
  periodInterval: 1000,
  tables: ['digital_coin'],
  printInterval: 30,
  proxy: 'shadow',
  //
  parallN: 1,
};
