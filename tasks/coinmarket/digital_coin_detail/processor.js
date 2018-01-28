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
  const { $, params, url } = record;
  const { tables } = record;
  const { coin_name } = params;
  //
  const leftInfoNode = $('.list-unstyled');
  const as = leftInfoNode.find('a');
  const website_url = as.filter((i, node) => {
    return $(node).text() === 'Website';
  }).attr('href');
  const explorer_url = as.filter((i, node) => {
    return $(node).text() === 'Explorer';
  }).attr('href');
  const code_url = as.filter((i, node) => {
    return $(node).text() === 'Source Code';
  }).attr('href');
  const coin_logo_img_url = $('.text-large').find('img').attr('src');
  const d = {
    coin_name,
    coin_logo_img_url,
    explorer_url,
    code_url,
    website_url,
  };
  //
  Utils.batchUpsert(tables.digital_coin, [Utils.cleanObjectNull(d)])
  .then(() => success(null))
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
