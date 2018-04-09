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

module.exports = (record, success, fail) => {
  const { $, tables, params } = record;
  const results = [];
  $('.table-responsive').find('tbody').find('tr').each((i, d) => {
    const tds = $(d).find('td');
    // 1
    const node1 = $(tds[1]);
    const nameNode = node1.find('span');
    const coin_name = nameNode.text();
    const coin_full_name = node1.find('.currency-name-container').text();
    const trend_url = getUrl(nameNode.find('a').attr('href'));
    //
    let base_coin = '';
    if (params.type === 'token') {
      const node2 = $(tds[2]);
      base_coin = node2.text();
    }

    // 3
    const capText = $(tds[3]).text();
    const market_cap = getNumber(capText);
    // 4
    const priceNode = $(tds[4]);
    const priceText = priceNode.text();
    const price = getNumber(priceText);
    const market_url = getUrl(priceNode.find('a').attr('href'));
    // 5
    const circulatingNode = $(tds[5]);
    let circulating_supply = circulatingNode.find('a').text();
    circulating_supply = getNumber(circulating_supply);
    // 7
    const volumeNode = $(tds[6]);
    const volumeText = volumeNode.text();
    const volumn_24h = getNumber(volumeText);
    let data = {
      coin_name,
      coin_full_name,
      trend_url,
      market_cap,
      market_url,
      price,
      circulating_supply,
      volumn_24h,
      base_coin
    };
    data = Utils.cleanObjectNull(data);
    results.push(data);
  });
  // json = Gaodefy.parseDistrict(json);
  Utils.batchUpsert(tables.digital_coin, results)
  .then(() => success(null))
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
