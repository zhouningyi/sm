/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

const dblink = require('./../../../lib/dblink');

function getUrl(url) {
  const arr = url.split('\/');
  const lastName = arr[arr.length - 2];
  return `https://graphs2.coinmarketcap.com/currencies/${lastName}/`;
}

module.exports = {
  name: 'digital_coin_chart',
  desc: '比特币图表',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    dblink.findAll(db_id, 'public', 'digital_coin', {
      attributes: ['trend_url', 'coin_full_name'],
    }).then((d) => {
      d = d.data;
      const urls = {};
      _.forEach(d, (line) => {
        const { trend_url, coin_full_name } = line;
        const url = getUrl(trend_url);
        urls[url] = { url, params: { coin_full_name } };
      });
      // console.log(urls);
      // process.exit();
      cb(urls);
    });
  },
  parseType: 'json',
  periodInterval: 1000,
  tables: ['digital_coin_trend'],
  printInterval: 30,
  //
  parallN: 1,
};
