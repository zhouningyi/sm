/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');

module.exports = function (record, success, fail) {
  const Models = record.models;
  const model = Models.house_lianjia_city;
  //
  const $ = record.$;
  $('.mod_box').find('a')
  .each((i, node) => {
    const $node = $(node);
    const href = $node.attr('href') || '';
    const city_name = $node.text();
    const pinyin = href.replace(/\//g, '');
    const result = { city_name, pinyin };
    console.log(result);
    Utils.upsertPg(model, result);
  });
  return success(null);
};
