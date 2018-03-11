/**
 * 爬取配置
 */
const _ = require('lodash');
// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'okex_future_kline',
  desc: 'okex期货交易k线图信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    const urls = {};
    const dates = 7; // 7天
    const apiLimit = 300; // 一次请求返回数
    const timeInterval = apiLimit * 60 * 1000; // 请求limit对应的毫秒数
    const interval1Day = 1000 * 60 * 60 * 24; // 一天的毫秒数
    const now = new Date().getTime();
    const timeStart = now - interval1Day * dates;
    const interval = 'quarter';
    const pairs = ['btc_usd', 'eth_usd'];
    _.forEach(pairs, (pair) => {
      _.range(timeStart, now, timeInterval).reverse().forEach((time) => {
        const url = `https://www.okex.com/api/v1/future_kline.do?symbol=${pair}&type=1min&contract_type=${interval}&since=${time}`;
        urls[url] = { url, params: { pair } };
      });
    });
    cb(urls);
  },
  parseType: 'json',
  periodInterval: 1000,
  proxy: 'shadow',
  models: ['future_kline_1m_okex'],
  printInterval: 30,
  parallN: 3,
};
