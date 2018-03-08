/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');
const md5 = require('md5');


module.exports = (record, success, fail) => {
  const { tables, json, url } = record;
  // const ds = _.get(json, 'data.content');

  const results = _.map(json, (d) => {
    const pair = 'usd_btc';
    const t = parseFloat(d[0], 10);
    const time = new Date(t);
    const open = d[1];
    const high = d[2];
    const low = d[3];
    const close = d[4];
    const volume = d[5];
    return {
      unique_id: md5(`${d[0]}_${pair}_1m`),
      open_time: time,
      open,
      high,
      pair,
      low,
      close,
      volume
    };
  });
  //
  Utils.batchUpsert(tables.future_kline_1m_okex, results)
  .then(() => success(null))
  .catch((e) => {
    // console.log(e.sql);
    return fail('xx原因');
  });
};
