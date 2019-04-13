/**
 * 爬取配置
 */
const _ = require('lodash');
// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'okex_c2c',
  desc: 'okex 场外交易信息',
  time: {
    value: 10,
    type: 'interval'
  },
  headers: {
    'cf-ray': '44c5b9cbded2a2f6-HKG',
    authorization: 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxYjA4NzQ2MS0yMjZhLTQ1ODEtYTU5ZC01ZGEyMmFmYjRmODJYemVFIiwidWlkIjoidit5Y1FBQmpVc2o1VHVLRFpmVmNhUT09Iiwic3RhIjowLCJtaWQiOjAsImlhdCI6MTUzNDYwOTQwMCwiZXhwIjoxNTM1MjE0MjAwLCJiaWQiOjAsImRvbSI6Ind3dy5va2V4LmNvbSIsImlzcyI6Im9rY29pbiJ9.hoVDYRNU6rm7DLk3zRoewk42nco5GXkTfgrChtFmhxDt0w8nnugFZLkQKHDzb7NLrGk3nEEPtsSeuxELkuZKZw',
    // ':path': '/v2/c2c-open/tradingOrders/group?digitalCurrencySymbol=usdt&legalCurrencySymbol=cny&best=1&exchangeRateLevel=0&paySupport=0',
  },
  urls: (cb, db_id) => {
    const urls = {};
    const url = 'https://www.okex.com/v2/c2c-open/tradingOrders/group?digitalCurrencySymbol=usdt&legalCurrencySymbol=cny&best=1&exchangeRateLevel=0&paySupport=0';
    urls[url] = { url };
    cb(urls);
  },
  parseType: 'json',
  periodInterval: 1000,
  proxy: 'shadow',
  models: ['kline_1m_okex'],
  printInterval: 30,
  parallN: 3,
};
