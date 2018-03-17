/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Utils = require('./../../../lib/utils');
const api = require('./api');

const Binance = require('binance-api-node').default;

// const dblink = require('./../../../lib/dblink');
const pairs = ['ETHBTC'];
const b = new Binance();
module.exports = {
  name: 'binance_kline',
  desc: 'klines',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb) => {
    const dates = 10;
    const urlBase = 'https://api.binance.com/api/v1/klines?interval=1m';
    const interval1Day = 1000 * 3600 * 24;
    const interval500 = 500 * 60 * 1000;
    const now = new Date();
    const lowTime = now - interval1Day * dates;
    const result = {};
    const ds = api.exchangeInfo.symbols.map(d => d.symbol);
    let endTime = now.getTime();
    while (endTime > lowTime) {
      _.forEach(ds, (pair) => {
        const url = `${urlBase}&symbol=${pair}&startTime=${endTime - interval500}&endTime=${endTime}`;
        result[url] = { url, params: { pair } };
      });
      endTime -= interval500;
    }
    cb(result);
  },
  parseType: 'json',
  periodInterval: 1000,
  tables: ['kline_1m_binance'],
  printInterval: 30,
  proxy: 'shadow',
  //
  parallN: 1,
};
