/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Utils = require('./../../../lib/utils');
const { future_kline, kline } = require('./../exchanges/schemas');

future_kline.name = 'future_kline_okex';
kline.name = 'kline_okex';

// const dblink = require('./../../../lib/dblink');
// const pairs = ['ETHBTC'];
// const b = new Binance();
module.exports = {
  name: 'okex_full',
  desc: 'okex_full',
  time: {
    value: 10,
    type: 'interval'
  },
  parseType: 'json',
  periodInterval: 1000,
  models: [future_kline, kline],
  printInterval: 30,
  proxy: 'shadow',
  //
  parallN: 1,
};
