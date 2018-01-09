/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');
const _ = require('lodash');

module.exports = function (record, success, fail) {
  const Model = record.models.house_lianjia_detail;

  const json = record.json;
  if (!json) return fail();
  const line = json.data;
  if (!line) return fail();

  let d = {
    trade_id: line.house_code,
    trade_type: line.kv_house_type,
    title: line.title,
    bedroom_n: line.blueprint_bedroom_num,
    hall_n: line.blueprint_hall_num,
    area: line.area,
    price_per_square: line.sign_unit_price || line.unit_price,
    house_direction: line.orientation,
    tags: line.tags,
    building_type: line.building_type,
    lat_baidu: line.baidu_la,
    lng_baidu: line.baidu_lo,
    community_name: line.community_name,
    community_id: line.community_id,
    trade_url: line.m_url,
    status: 'selling'
  };

  console.log(d);

  if (line.house_see_record_info) {
    const house_see_record_info = line.house_see_record_info;
    d.views = house_see_record_info.total_see_count;
    d.view_1_month = house_see_record_info.last_month_see_count;
  }

  if (line.blueprint_hall_num && line.blueprint_bedroom_num) {
    house_structure_type = d.house_structure_type = `${line.blueprint_bedroom_num}室${line.blueprint_hall_num}厅`;
  }

  if (line.floor_state) {
    const floor_state = line.floor_state;
    floor_states = floor_state.split('\/');
    d.building_floor_total = parseInt(floor_states[1]);
    d.building_floor = floor_states[0];
  }

  d = Utils.cleanObjectNull(d);

  Model.upsert(d).then(() => {});

  return success(null);
};
