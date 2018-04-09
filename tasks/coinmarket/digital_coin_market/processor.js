/**
 *处理方法
 */
const Utils = require('./../../../utils');
const coinUtils = require('./../utils');
const _ = require('lodash');
const md5 = require('md5');


function getUrl(relPath) {
  return `https://coinmarketcap.com${relPath}`;
}

const base = 'https://coinmarketcap.com';

function getNumber(str) {
  if (!str) return null;
  let price = str.replace(/,/g, '');
  price = price.replace(/\$/g, '');
  return parseFloat(price, 10);
}

function getPercent(str) {
  if (!str) return null;
  const price = str.replace(/%/g, '');
  return parseFloat(price, 10) / 100;
}

module.exports = async (record, success, fail) => {
  const { $, url } = record;
  const { models } = record;
  const dom = $('.table-responsive');
  const ds = [];
  const dsHistory = [];
  dom.find('tbody').find('tr').each((i, d) => {
    const tds = $(d).find('td');
    // 1
    const marketNode = $(tds[1]).find('a');
    const market_name = marketNode.text();
    const market_url = base + marketNode.attr('href');
    // 2
    let pair = $(tds[2]).find('a').text();
    pair = pair.split('/').join('-');
    // 3
    const volumeText = $(tds[3]).find('span').text();
    const volume_24 = getNumber(volumeText);
    // 4
    const priceText = $(tds[4]).find('span').text();
    const price_usd = getNumber(priceText);
    console.log(url, price_usd, priceText, 'price_usd....');
    // 5
    const percent = $(tds[5]).text();
    const volume_pair_percent = getPercent(percent);

    // 6
    const unique_id = `${market_name}_${pair}`;
    const pairs = pair.split('-');
    let data = {
      unique_id,
      exchange: market_name,
      market_url,
      time: new Date(),
      pair,
      volume_24_usd: volume_24,
      volume_pair_percent,
      price_usd,
      left_coin: pairs[0],
      right_coin: pairs[1],
    };
    data = Utils.cleanObjectNull(data);
    ds.push(data);
    dsHistory.push({
      ...data,
      unique_id: md5(coinUtils.getUniqueId(unique_id) + price_usd)
    });
  });
  await Promise.all([
    Utils.batchUpsert(models.pair_price_coinmarketcap, ds),
    Utils.batchUpsert(models.pair_price_history_coinmarketcap, dsHistory)
  ]);
  success();
};
