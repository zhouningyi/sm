/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

const dblink = require('./../../../lib/dblink');

function getUrl(name) {
  return `https://coinmarketcap.com/currencies/${name}/#markets`;
}
module.exports = {
  name: 'digital_coin_market',
  desc: '比特币交易所信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: async (cb, db_id) => {
    //    const ds = await dblink.query(db_id, 'select market_url from public.digital_coin');
    const ds = await dblink.findAll(db_id, 'public', 'digital_coin', { attributes: ['market_url'] });
    const d = ds.data;
    const urls = {};
    _.forEach(d, (line) => {
      const url = line.market_url;
      urls[url] = { url };
    });
    cb(urls);
  },
  parseType: 'dom',
  periodInterval: 1000,
  models: ['pair_price_coinmarketcap', 'pair_price_history_coinmarketcap'],
  printInterval: 30,
  end: {
    type: 'restart',
    isUpdate: true
  },
  //
  parallN: 5,
};

