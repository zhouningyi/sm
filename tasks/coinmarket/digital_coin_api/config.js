/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

const dblink = require('./../../../lib/dblink');

function getUrl(url) {
  const arr = url.split('\/');
  const name = arr[arr.length - 2];
  return `https://api.coinmarketcap.com/v1/ticker/${name}/`;
}

module.exports = {
  name: 'digital_coin_api',
  desc: '比特币接口',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    dblink.findAll(db_id, 'public', 'digital_coin', {
      attributes: ['trend_url'],
      where: {
        // circle_percent: {
        //   $gte: 0.9
        // }
      }
    }).then((d) => {
      d = d.data;
      const urls = {};
      _.forEach(d, (line) => {
        const url = getUrl(line.trend_url);
        urls[url] = { url };
      });
      cb(urls);
    });
  },
  parseType: 'json',
  periodInterval: 1000,
  tables: ['digital_coin'],
  printInterval: 30,
  proxy: 'shadow',
  //
  parallN: 1,
};
