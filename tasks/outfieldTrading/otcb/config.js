/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'otcb_coin',
  desc: '比特币信息',
  // time: {
  //   value: 10,
  //   type: 'interval'
  // },
  urls: (cb, db_id) => {
    const url = 'https://otcbtc.com/sell_offers?currency=btc&fiat_currency=cny&payment_type=all';
    const result = {};
    result[url] = { url };
    result[`${url}_`] = { url };
    cb(result);
  },
  parseType: 'dom',
  periodInterval: 10000,
  tables: ['otcb_coin'],
  printInterval: 30,
  proxy: 'shadow',
  //
  parallN: 1,
};
