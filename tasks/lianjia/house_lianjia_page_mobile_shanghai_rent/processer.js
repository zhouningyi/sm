/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var _ = require('lodash');

module.exports = function(record, success, fail) {
  const {house_lianjia_details_rent_byplate, house_lianjia_details_rent_byplate_history} = record.models;

  // console.log(record.url)

  //school_info  school_infoschool_infoschool_infoschool_infoschool_infoschool_infoschool_infoschool_infoschool_infoschool_infoschool_infoschool_infoschool_infoschool_info

  const {json} = record;
  if (!json) return fail('no json');
  var jsonD = json.data;
  if (!jsonD) return fail('no data');
  var list = jsonD.list;
  var url = record.url;
  var data = record.params;
  let now = new Date()
  if (list) {
    list.forEach(function(line) {
      var d = {
        trade_id: line.houseRentId || '',
        price_rent_total: line.rentPrice,
        area: line.acreage,
        house_direction: line.face,
        lat_baidu: line.latitude,
        lng_baidu: line.longitude,
        community_name: line.propertyName,
        community_id: line.propertyNo,
        bedroom_n: line.room,
        tags: line.tags,
        trade_type: 'rent',
        title: line.title,
        status: 'selling',
        online_date_last: now,
        house_type: line.houseType,
        views: line.lookCount
      };

      // console.log(d, '\n\n')

      if (line.floor_state) {
        var floor_state = line.floorState || '';
        floor_states = floor_state.split('\/');
        d.building_floor_total = parseInt(floor_states[1]);
        d.building_floor = floor_states[0];
      }

      d = Utils.cleanObjectNull(d);

      house_lianjia_details_rent_byplate.upsert(d).then(function() {});
      // house_lianjia_details_rent_byplate_history.upsert({
      //   trade_id: d.trade_id,
      //   price_rent_total: d.price_rent_total,
      //   unique_id: [d.trade_id, d.price_rent_total].join('_')
      // });

      if (line.propertyNo) {
        var d = Utils.cleanObjectNull({
          community_id: line.propertyNo,
          community_name: line.propertyName
        });
        record.models.house_lianjia_community.upsert(d).then(function() {});
      }
    });
  }
  return success(null);
};
