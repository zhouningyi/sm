/**
 *处理方法
 */
const Utils = require('./../../../utils');
// const _ = require('lodash');


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
  const { $, params } = record;
  const { tables } = record;
  const { date } = params;
  const date_time = new Date(`${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`);
  const results = [];
  $('.table-responsive').find('tbody').find('tr').each((i, node) => {
    const tds = $(node).find('td');
    //
    const node1 = $(tds[1]);
    const nameNode = node1.find('span');
    const coin_name = nameNode.text();
    // 3
    const capText = $(tds[3]).text();
    const market_cap = getNumber(capText);
    // 4
    const priceNode = $(tds[4]);
    const priceText = priceNode.text();
    const price = getNumber(priceText);
    // 5
    const circulatingNode = $(tds[6]);
    let circulating_supply = circulatingNode.find('a').text();
    circulating_supply = getNumber(circulating_supply);
    // 7
    const volumeNode = $(tds[7]);
    const volumeText = volumeNode.text();
    const volumn_24h = getNumber(volumeText);

    const unique_id = `${date}_${coin_name}`;
    const d = {
      unique_id,
      date: date_time,
      coin_name,
      market_cap,
      circulating_supply,
      price,
      volumn_24h,
    };
    results.push(d);
  });


  Utils.batchUpsert(tables.digital_coin_history, results)
  .then(() => success(null))
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
