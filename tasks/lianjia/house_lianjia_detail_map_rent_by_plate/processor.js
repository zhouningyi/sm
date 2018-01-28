/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var _ = require('lodash');

module.exports = function(record, success, fail) {
  const {house_lianjia_details_rent_byplate_history, house_lianjia_details_rent_byplate} = record.models;
  //
  let {json} = record;
  if(!json) return fail('no json...');
  let ds = json.data;
  if (!ds) return fail('no data length...');
  let {list} = ds;
  if (!list || !list.length) return fail('no list length...');

  ds.list.forEach((d) => {
    console.log(d);
    let item = {
      trade_id: '' + (d.house_code || ''),
      rent_area: parseFloat(d.rent_area, 10),
      price_rent_total: parseInt(d.price_total, 10),
      house_direction: d.frame_orientation,
      bedroom_n: parseFloat(d.frame_bedroom_num, 10),
      trade_date_start_online: new Date(d.ctime),
      decoration: d.decoration,
      rent_type: d.rent_type,
      community_id: d.community_id,
      community_name: d.community_name,
      is_ziroom: d.is_ziroom ? true : false,
      house_picture_count: d.house_picture_count,
      title: d.title,
      tags: (d.tags || '').split(','),
      price_history: d.house_price_history,
      trade_type: 'rent',
      online_date_last: new Date()
    };
    // console.log('\n\n\n\n', item, '\n\n\n\n')
    if(!d.house_code){
      // console.log(record.url)
      // console.log('\n\n\n\n', item, '\n\n\n\n')
    }
    Utils.upsertPg(house_lianjia_details_rent_byplate, item);
    Utils.upsertPg(house_lianjia_details_rent_byplate_history, {
      trade_id: item.trade_id,
      price_rent_total: item.price_rent_total,
      unique_id: [item.trade_id, item.price_rent_total].join('_')
    });
  });

  return success(null);
};
