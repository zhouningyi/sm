/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');

module.exports = function(record, success, fail) {
  const Models = record.models;
  const model = Models.house_lianjia_city;
  //
  const $ = record.$;
  $('.nhouse_list').find('li')
  .each((i, node) => {
    let item = {};
    const $node = $(node);
    const fl = $node.find('.fl').find('h4');
    const header = fl.find('a');
    const url = header.attr('href');
    const community_name = header.text();
    const add = $node.find('.add');
    const address = add.find('a').text();
    item = {url, community_name, address};
    item = Utils.cleanObjectNull(item);
    console.log(item);
  });
  return success(null);
};
