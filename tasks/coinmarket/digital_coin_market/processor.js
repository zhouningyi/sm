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
  const { $ } = record;
  const { tables } = record;
  const dom = $('.table-responsive');
  const results = [];
  dom.find('tbody').find('tr').each((i, d) => {
    const tds = $(d).find('td');
    // 1
    const marketNode = $(tds[1]).find('a');
    const market_name = marketNode.text();
    const market_url = marketNode.attr('href');
    // 2
    const pair = $(tds[2]).find('a').text();
    // 3
    const volumnText = $(tds[3]).find('span').text();
    const volumn_24 = getNumber(volumnText);
    // 4
    const priceText = $(tds[4]).find('span').text();
    const price = getNumber(priceText);
    // 5
    const percent = $(tds[5]).text();
    const volumn_percent = getPercent(percent);

    // 6
    const unique_id = `${market_name}_${pair}`;
    let data = {
      unique_id,
      market_name,
      market_url,
      pair,
      volumn_24,
      price,
      volumn_percent,
    };
    data = Utils.cleanObjectNull(data);
    results.push(data);
  });
  // json = Gaodefy.parseDistrict(json);
  Utils.batchUpsert(tables.digital_coin_market, results)
  .then(() => success(null))
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
