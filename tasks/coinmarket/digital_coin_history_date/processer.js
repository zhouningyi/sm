/**
 *处理方法
 */
const Utils = require('./../../../utils');
// const _ = require('lodash');


function getUrl(relPath) {
  return `https://coinmarketcap.com${relPath}`;
}

module.exports = (record, success, fail) => {
  const { $ } = record;
  const { tables } = record;
  const results = [];
  $('.text-center').find('a').each((i, node) => {
    node = $(node);
    const url = node.attr('href');
    if (!url) return;
    const strs = url.split('\/').filter(d => d);
    const date = strs[strs.length - 1];
    const d = { url: getUrl(url), date };
    results.push(d);
  });
  Utils.batchUpsert(tables.digital_coin_history_dates, results)
  .then(() => success(null))
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
