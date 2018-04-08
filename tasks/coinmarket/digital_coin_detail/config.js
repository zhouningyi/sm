/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'digital_coin_detail',
  desc: '比特币细节信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    dblink.findAll(db_id, 'public', 'digital_coin').then((ds) => {
      ds = ds.data;
      const result = {};
      _.forEach(ds, (d) => {
        const url = d.market_url;
        result[url] = { url, params: { coin_name: d.coin_name } };
      });
      cb(result);
    });
  },
  parseType: 'dom',
  periodInterval: 1000,
  tables: ['digital_coin'],
  printInterval: 30,
  proxy: 'shadow',
  //
  parallN: 5,
};
