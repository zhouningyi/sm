/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');

module.exports = (record, success, fail) => {
  const { json, tables, params } = record;
  // console.log(json, 'json...');
  const result = _.map(json, (d) => {
    return {
      unique_id: `${d[0]}_${params.pair}_1m`,
      pair: params.pair,
      open_time: new Date(d[0]),
      open: parseFloat(d[1], 10),
      high: parseFloat(d[2], 10),
      low: parseFloat(d[3], 10),
      close: parseFloat(d[4], 10),
      volume: parseFloat(d[5], 10),
      quote_asset_volume: parseFloat(d[7], 10),
      trades_count: parseInt(d[8], 10),
      taker_buy_base_asset_volume: parseInt(d[9], 10),
      taker_buy_quote_asset_volume: parseInt(d[10], 10),
    };
  });
  //
  Utils.batchUpsert(tables.kline_1m_binance, result)
  .then(() => success(null))
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
