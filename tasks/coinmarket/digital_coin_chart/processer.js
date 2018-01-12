/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');


function getUrl(relPath) {
  return `https://coinmarketcap.com${relPath}`;
}

function getNumber(str) {
  if (!str) return null;
  let price = str.replace(/,/g, '');
  price = price.replace(/\$/g, '');
  return parseFloat(price, 10);
}

function getPercent(str) {
  if (!str) return null;
  const price = str.replace(/%/g, '');
  return parseFloat(price, 10 / 100);
}

module.exports = (record, success, fail) => {
  const { json, params } = record;
  const { tables } = record;
  const { market_cap_by_available_supply, price_btc, price_usd, volume_usd } = json;
  const results = [];
  const { coin_full_name } = params;
  _.forEach(market_cap_by_available_supply, (supply, i) => {
    const date = new Date(parseFloat(supply[0], 10));
    const unique_id = `${supply[0]}_${coin_full_name}`;
    //
    const d = {
      unique_id,
      date,
      coin_full_name,
      price_btc: price_btc[i][1],
      price_usd: price_usd[i][1],
      market_cap_by_available_supply: market_cap_by_available_supply[i][1],
      volume_usd: volume_usd[i][1]
    };
    results.push(d);
  });
  //
  Utils.batchUpsert(tables.digital_coin_trend, results)
  .then(() => success(null))
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
