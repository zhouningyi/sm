/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Utils = require('./../../../lib/utils');
const dblink = require('./../../../lib/dblink');
// /8D6E1YPS5PZUP3K9TRCHV7AKNKAP1WSM9K
function getUrl(coin) {
  return `https://www.okex.com/v3/c2c/tradingOrders/book?side=all&baseCurrency=${coin}&quoteCurrency=cny&userType=certified&paymentMethod=all`;
}
module.exports = {
  name: 'okex_otc',
  desc: 'okex_otc',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: async (cb, db_id) => {
    const urls = {};
    const coins = ['usdt', 'btc', 'eth', 'etc', 'ltc', 'eos', 'bch', 'qtum', 'neo'];
    _.forEach(coins, (coin) => {
      const url = getUrl(coin);
      urls[url] = { url, params: { coin } };
    });
    cb(urls);
  },
  parseType: 'json',
  models: ['otc', 'otc_user', 'otc_tick'],
  headers: {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    UserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
  },
  end: {
    type: 'restart',
    isUpdate: true,
    isClean: true,
  },
  printInterval: 1,
  parallN: 1,
  proxy: 'shadow',
};
