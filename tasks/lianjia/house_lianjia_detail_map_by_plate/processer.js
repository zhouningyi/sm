/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var _ = require('lodash');

module.exports = function(record, success, fail) {
  const {house_lianjia_details_byplate, house_lianjia_details_byplate_history} = record.models;
  //
  let {json} = record;
  if(!json) return fail('no json...');
  let ds = json.data;
  if (!ds) return fail('no data length...');
  let {list} = ds;
  if (!list || !list.length) return fail('no list length...');

  ds.list.forEach(d => {
    let item = {
      trade_id: d.house_code + '',
      title: d.title,
      bedroom_n: parseFloat(d.frame_bedroom_num, 10),
      house_direction: d.frame_orientation,
      area: parseFloat(d.house_area, 10),
      price_total: parseFloat(d.price_total, 10) * 10000,
      tags: (d.tags || '').split(','),
      is_two_five: d.is_two_five,
      community_id: d.community_id,
      community_name: d.community_name,
      price_history: d.house_price_history,
      trade_type: 'sell',
      online_date_last: new Date()
    }
    Utils.upsertPg(house_lianjia_details_byplate, item);
    Utils.upsertPg(house_lianjia_details_byplate_history, {
      trade_id: item.trade_id,
      price_total: item.price_total,
      unique_id: [item.trade_id, item.price_total].join('_')
    });
  });

  return success(null);
};
