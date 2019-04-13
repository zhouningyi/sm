/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Utils = require('./../../../lib/utils');
const { full_tick, full_tick_history } = require('./../exchanges/schemas');

// const dblink = require('./../../../lib/dblink');
// const pairs = ['ETHBTC'];
// const b = new Binance();
module.exports = {
  name: 'okex_full_tick',
  desc: 'okex_full_tick',
  time: {
    value: 10,
    type: 'interval'
  },
  parseType: 'json',
  periodInterval: 1000,
  models: [full_tick, full_tick_history],
  printInterval: 30,
  proxy: 'shadow',
  //
  parallN: 1,
};
