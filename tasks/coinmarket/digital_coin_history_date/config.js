/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
// const _ = require('lodash');

// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'digital_coin_history_date',
  desc: '获取所有有交易历史存档的日期的url',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    const url = 'https://coinmarketcap.com/historical/';
    const result = {};
    result[url] = { url };
    cb(result);
  },
  parseType: 'dom',
  periodInterval: 1000,
  tables: ['digital_coin_history_dates'],
  printInterval: 30,
  //
  parallN: 1,
};
