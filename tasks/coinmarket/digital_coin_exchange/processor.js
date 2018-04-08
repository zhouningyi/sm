/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');

const coinUtils = require('./../utils');
const md5 = require('md5');

function getNumber(str) {
  if (!str) return null;
  let price = str.replace(/,/g, '');
  price = price.replace(/\$/g, '');
  let base = 1;
  if (price.indexOf('M') !== -1) base = 1000 * 1000;
  if (price.indexOf('K') !== -1) base = 1000;
  return base * parseFloat(price, 10);
}

function getPercent(str) {
  if (!str) return null;
  const price = str.replace(/%/g, '');
  return parseFloat(price, 10) / 100;
}

const base = 'https://coinmarketcap.com';
module.exports = async (record, success, fail) => {
  const { $, models } = record;
  const exchanges = [];
  const pairs = [];
  const pair_prices = [];
  const pair_prices_history = [];
  let name;
  let coinmarketcap_url;
  $('.table-responsive').find('tbody').find('tr').each((i, node) => {
    node = $(node);
    const id = node.attr('id');
    if (id) {
      const a = node.find('a');
      coinmarketcap_url = base + a.attr('href');
      name = a.text();
      const line = { name, coinmarketcap_url };
      exchanges.push(line);
    } else {
      const tds = node.find('td');
      const node2 = $(tds[2]);
      const nameNode = node2.find('a');
      let pair = nameNode.text();
      pair = pair.replace(/\//g, '-');
      //
      const node3 = $(tds[3]);
      const volumeText = node3.text();
      const volume_24_usd = getNumber(volumeText);
      //
      const node4 = $(tds[4]);
      const priceText = node4.text();
      const price_usd = getNumber(priceText);
      //
      const node5 = $(tds[5]);
      const volume_percent_Text = node5.text();
      const volume_exchange_percent = getPercent(volume_percent_Text);
      if (pair) {
        const unique_id = `${name}_${pair}`;
        const pairs = pair.split('-');
        const line = {
          unique_id,
          exchange: name,
          pair,
          time: new Date(),
          volume_24_usd,
          price_usd,
          volume_exchange_percent,
          left_coin: pairs[0],
          right_coin: pairs[1],
        };
        pair_prices.push(line);
        const lineHistory = {
          ...line,
          unique_id: md5(coinUtils.getUniqueId(unique_id) + price_usd)
        };
        pair_prices_history.push(lineHistory);
      }
    }
  });
  // console.log(pair_prices_history, 'pair_prices_history');

  try {
    await Promise.all([
      Utils.batchUpsert(models.exchange, exchanges),
      Utils.batchUpsert(models.pair_price_history_coinmarketcap, pair_prices_history),
      Utils.batchUpsert(models.pair_price_coinmarketcap, pair_prices)
    ]);
    success();
  } catch (e) {
    console.log(e);
    fail();
  }
};
