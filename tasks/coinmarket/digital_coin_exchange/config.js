
/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

const dblink = require('./../../../lib/dblink');


module.exports = {
  name: 'digital_coin_exchange',
  desc: 'digital_coin_exchange',
  time: {
    value: 0.01,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    const url = 'https://coinmarketcap.com/exchanges/volume/24-hour/';
    const urls = { [url]: { url } };
    cb(urls);
  },
  parseType: 'dom',
  periodInterval: 1000,
  models: ['exchange', 'pair_price_coinmarketcap', 'pair_price_history_coinmarketcap'],
  printInterval: 5,
  proxy: 'shadow',
  end: {
    type: 'restart',
    isUpdate: true
  },
  //
  parallN: 2,
};
