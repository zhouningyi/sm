/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');
const _ = require('lodash');


var Utils = require('./../../../../lib/utils');
var _ = require('lodash');

module.exports = async function (record, success, fail) {
  const Model = record.models.house_lianjia_detail;
  // const historyModel = record.models.house_lianjia_details_byapp_history;
  const json = record.json;
  if (!json) return fail();
  const data = json.data;
  if (!data) return fail('no data 字段');

  try {
    const d = record.params.data;
    const building_floor = data.basic_info ? data.basic_info.floor_state : null;
    let building_floor_total;
    const building_floor_num = data.basic_info ? data.basic_info.floor_state.match(/([0-9]+)/) : null;
    if (!building_floor_num || !building_floor_num[1]) {
      building_floor_total = null;
    } else {
      building_floor_total = Number(building_floor_num[1]);
    }

    let date_view_last;
    if (!data.house_news || !data.house_news.all_see_record || !data.house_news.all_see_record.desc) {
      date_view_last = null;
    } else {
      const last_view = data.house_news.all_see_record.desc.match(/([0-9\.]+)/);
      if (!last_view || !last_view[1]) {
        date_view_last = null;
      } else {
        date_view_last = new Date(last_view[1]);
      }
    }

    let house_age;
    const age = data.info_list[7].value.match(/([0-9]+)/);
    if (!age || !age[1]) {
      house_age = null;
    } else {
      house_age = new Date().getFullYear() - Number(age[1]);
    }

    const upsertData = {
      ...d,
      price_total: data.basic_info.price,
      price_per_square: data.basic_info.unit_price,
      area: data.basic_info.area,
      lat_baidu: data.location.baidu_la,
      lng_baidu: data.location.baidu_lo,
      trade_date_start_online: new Date(data.info_list[1].value).toISOString(),
      title: data.basic_info.title,
      bedroom_n: data.basic_info.blueprint_bedroom_num,
      hall_n: data.basic_info.blueprint_hall_num,
      house_type: data.info_list[8].value,
      house_direction: data.info_list[2].value,
      building_floor,
      building_floor_total,
      tags: data.color_tags ? data.color_tags.map(tag => tag.desc) : [],
      decoration: data.info_list[6].value,
      community_id: data.basic_info.community_id,
      community_name: data.basic_info.community_name,
      building_complete_year: data.info_list[7].value,
      date_view_last,
      house_age,
      view_7_days: data.house_news.list[0].value,
      view_1_month: data.house_news.list[1].value,
      focus: data.house_news.list[2].value,
      building_type: data.info_list[4].value,
      online_date_last: new Date().toISOString(),
    };

    const historyData = {
      unique_id: `${upsertData.view_1_month}-${upsertData.house_id}-${upsertData.price_total}`,
      house_id: upsertData.house_id,
      price_total: upsertData.price_total,
      view_1_month: upsertData.view_1_month,
    };
    console.log(upsertData, historyData);
    // await Model.upsert(upsertData);
    // await historyModel.upsert(historyData);
  } catch (e) {
    console.log(e);
    fail(e);
  }

  return success();
};


module.exports = function (record, success, fail) {
  const Model = record.models.house_lianjia_detail;

  const { json } = record;
  if (!json) return fail();
  const propertySold = json.propertySold;
  if (!propertySold) return fail();
  const { houseSell } = json;
  if (!houseSell) return fail();

  const data = record.params;

  let line = {};
  if (propertySold.pageList && propertySold.pageList[0]) {
    line = propertySold.pageList[0];
  }

  let sellStatus = 'selling';
  if (houseSell.putAway === 0) {
    sellStatus = 'offline';
  } else if (houseSell.putAway === 2) {
    sellStatus = 'sold';
  }

  let trade_date_start;
  if (line.soldDate) {
    trade_date_start = new Date(line.soldDate);
  }

  let trade_date_start_online;
  if (houseSell.onlineTime) {
    trade_date_start_online = new Date(houseSell.onlineTime);
  }

  let trade_date_last;
  if (houseSell.buyTimeString) {
    trade_date_last = new Date(houseSell.buyTimeString);
  }

  let tags;
  if (houseSell.tags) {
    tags = houseSell.tags.split(',');
  }
  console.log(houseSell.lookCount90, houseSell.lookCount7);
  let d = {
    building_complete_year: line.buildingYear,
    house_type: line.houseType,
    trade_type: 'sell',
    status: sellStatus,
    decoration: line.decoration,
    house_direction: line.face,
    trade_id: `${houseSell.id}`,
    title: line.title,
    trade_date_last,
    trade_date_start,
    trade_date_start_online,
    house_id: houseSell.houseId,
    views: houseSell.lookCount90,
    view_7_days: houseSell.lookCount7,
    bedroom_n: houseSell.room,
    price_total: houseSell.showPrice,
    area: houseSell.acreage,
    trade_url: houseSell.webUrl,
    price_per_square: houseSell.unitPrice,
    guard: houseSell.guard,
    // tags: tags,
    building_type: houseSell.propertyUsage || houseSell.type,
    lat_baidu: line.latitude,
    lng_baidu: line.longitude,
    community_name: line.propertyName,
    community_id: line.propertyNo,
    loan_first_time: houseSell.firstPay * 10000,
    loan_per_month: houseSell.monthPay
  };

  d = Utils.cleanObjectNull(d);
  // console.log(d);

  // console.log(d);

  Model.upsert(d).then(() => {});

  return success(null);
};
