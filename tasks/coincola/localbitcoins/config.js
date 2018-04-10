/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'localbitcoins',
  desc: '比特币信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: async (cb, db_id) => {
        // const url = 'https://localbitcoins.com/api/currencies/';

        // const maxId = _.get(data, '0.max') || 10000;
        // const pageSize = 10;
        // const delta = 400;
        // _.range(pages).reverse().forEach((idx) => {
        //     const url = `https://localbitcoins.com/sell-bitcoins-online/.json?page=${page}`;
        //     urls[url] = { url, params: { lastid: idx } };
        // });
        // cb(urls);
    const result = {};

    result[`https://localbitcoins.com/sell-bitcoins-online/.json?page=${1}`] = { url: `https://localbitcoins.com/sell-bitcoins-online/.json?page=${1}` };
    cb(result);
  },
  parseType: 'json',
  periodInterval: 10,
  models: ['localbitcoins'],
  printInterval: 30,
    //
  parallN: 1,
};
