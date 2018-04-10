/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Utils = require('./../../../lib/utils');

// const dblink = require('./../../../lib/dblink');
// const pairs = ['ETHBTC'];
// const b = new Binance();
module.exports = {
  name: 'binance_tick',
  desc: 'klines',
  time: {
    value: 10,
    type: 'interval'
  },
  parseType: 'json',
  periodInterval: 1000,
  models: ['ticks', 'ticks_history'],
  printInterval: 30,
  proxy: 'shadow',
  //
  parallN: 1,
};
