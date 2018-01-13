/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

const dblink = require('./../../../lib/dblink');


module.exports = {
  name: 'digital_coin_history',
  desc: '获取所有有交易历史存档',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    dblink.findAll(db_id, 'public', 'digital_coin_history_dates').then((ds) => {
      ds = ds.data;
      const result = _.map(ds, (d) => {
        return {
          url: d.url,
          params: {
            date: d.date
          }
        };
      });
      cb(result);
    });
  },
  parseType: 'dom',
  periodInterval: 1000,
  tables: ['digital_coin_history'],
  printInterval: 5,
  proxy: 'shadow',
  //
  parallN: 2,
};
