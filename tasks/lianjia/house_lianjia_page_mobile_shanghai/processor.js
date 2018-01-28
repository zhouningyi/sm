/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var _ = require('lodash');

module.exports = function(record, success, fail) {
  const {
      house_lianjia_details_byplate_history, 
      house_lianjia_details_byplate, 
      house_lianjia_detail, 
      house_lianjia_community
    } = record.models;

  var json = record.json;
  if (!json) return fail('no json');
  var jsonD = json.data;
  if (!jsonD) return fail('no data');
  var list = jsonD.list;
  var url = record.url;
  var data = record.params;
  let now = new Date();
  if (list) {
    list.forEach(function(line) {
      var d = {
        area: line.acreage,
        house_direction: line.face,
        trade_id: 'sh' +  line.houseSellId.replace('sh', ''),
        lat_baidu: line.latitude,
        lng_baidu: line.longitude,
        community_name: line.propertyName,
        community_id: line.propertyNo,
        bedroom_n: line.room,
        price_total: line.showPrice * 10000,
        tags: line.tags,
        price_per_square: line.unitPrice,
        trade_type: 'sell',
        title: line.title,
        adcode: data.adcode,
        status: 'selling',
        online_date_last: now
      };

      if (line.floor_state) {
        var floor_state = line.floor_state;
        floor_states = floor_state.split('\/');
        d.building_floor_total = parseInt(floor_states[1]);
        d.building_floor = floor_states[0];
      }

      // if(line.label){
      //   var tags = line.label.split(' ');
      //   line.tags = tags;
      // }

      d = Utils.cleanObjectNull(d);

      house_lianjia_detail.upsert(d);
      house_lianjia_details_byplate.upsert(d).catch(e => console.log(e, 'house_lianjia_details_byplate'));
      // console.log( d.price_total, ' d.price_total', d.trade_id, 'trade_id');
      // house_lianjia_details_byplate_history.upsert({
      //   trade_id:    d.trade_id,
      //   price_total: d.price_total,
      //   unique_id:  [d.trade_id, d.price_total].join('_')
      // }).catch(e => console.log(e, 'house_lianjia_details_byplate_history'));;

      if (line.community_id) {
        var d = Utils.cleanObjectNull({
          community_id: line.community_id,
          community_name: line.propertyName,
          adcode: data.adcode
        });
        house_lianjia_community.upsert(d);
      }
    });
  }
  return success(null);
};
