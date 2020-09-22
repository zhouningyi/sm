/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Utils = require('./../../../lib/utils');
const { future_kline, kline } = require('./../exchanges/schemas');

// future_kline.name = 'future_kline_binance';
kline.name = 'huobi_kline';

// const dblink = require('./../../../lib/dblink');
// const pairs = ['ETHBTC'];
// const b = new Binance();
module.exports = {
  name: 'huobi_kline',
  desc: 'huobi_kline',
  time: {
    value: 10,
    type: 'interval'
  },
  parseType: 'json',
  periodInterval: 1000,
  models: [kline],
  printInterval: 30,
  proxy: 'shadow',
  //
  parallN: 1,
};
