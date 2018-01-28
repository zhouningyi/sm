/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');


function getNumber(str) {
  if (!str) return null;
  let price = str.replace(/,/g, '');
  price = price.replace(/\$/g, '');
  return parseFloat(price, 10);
}

module.exports = (record, success, fail) => {
  let { json } = record;
  const { tables } = record;
  json = json[0];
  if (!json) return fail('没有结果...');
  const {
    market_cap_usd, max_supply, total_supply, available_supply, symbol
  } = json;
  //
  const d = {
    coin_name: symbol,
    market_cap: market_cap_usd,
    max_supply,
    available_supply,
    total_supply
  };
  //
  Utils.batchUpsert(tables.digital_coin, [d])
  .then(() => success(null))
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
