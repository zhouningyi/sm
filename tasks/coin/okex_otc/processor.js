/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');

function getNumber(v) {
  return v.replace(/^\D+/g, '');
}

function processLine(line, res, resUser) {
  // console.log(line);
}

module.exports = async (record, success, fail) => {
  const { $, url, json, tables, params } = record;// ticks_history_binance
  const { otc, otc_user, otc_tick } = tables;
  const { data } = json;
  if (!data) return fail('返回无数据');
  const { buy, sell } = data;
  const res = [];
  const resUser = [];
  _.forEach(buy, line => processLine(line, res, resUser));
  _.forEach(sell, line => processLine(line, res, resUser));
  const minBuy = sell[sell.length - 1];
  const maxSell = buy[0];
  const exchange = 'okex';
  const otc_tick_line = [{
    unique_id: `${exchange}_${params.coin}`,
    exchange,
    ask_price: _.get(minBuy, 'price'),
    bid_price: _.get(maxSell, 'price'),
    time: new Date(),
    coin: params.coin.toUpperCase()
  }];
  await Utils.batchUpsert(otc_tick, otc_tick_line);

  //
  setTimeout(() => success(), 4000);
};
