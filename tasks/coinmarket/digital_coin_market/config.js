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
  urls: (cb, db_id) => {
    dblink.findAll(db_id, 'public', 'digital_coin', { attributes: ['market_url'] }).then((d) => {
      d = d.data;
      const urls = {};
      _.forEach(d, (line) => {
        const url = line.market_url;
        urls[url] = { url };
      });
      cb(urls);
    });
  },
  parseType: 'dom',
  periodInterval: 1000,
  tables: ['digital_coin_market'],
  printInterval: 30,
  //
  parallN: 1,
};
