/**
 * 爬取配置
 */
const _ = require('lodash');

module.exports = {
  name: 'exchange_wallet',
  desc: '各个交易所的转账信息',
  time: {
    value: 10,
    type: 'interval'
  },
  headers: {
    // Host: 'www.aicoin.net.cn',
    // host: 'www.aicoin.net.cn',
    // Referer: 'https://www.aicoin.net.cn/',
    // userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
  },
  urls: (cb, db_id) => {
    const urls = {};
    const pageSize = 6268;
    _.range(0, pageSize).reverse().forEach((idx) => {
      const url = `https://www.walletexplorer.com/wallet/Bittrex.com?page=${idx}`;
      urls[url] = { url, params: { lastid: idx } };
    });
    cb(urls);
  },
  parseType: 'dom',
  periodInterval: 1000,
  proxy: 'shadow',
  models: ['exchange_wallet_bittrex'],
  // tables: ['aicoin_quicknews'],
  printInterval: 30,
  //
  parallN: 3,
};
