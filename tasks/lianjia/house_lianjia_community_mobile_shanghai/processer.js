/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');
const projection = require('./../../../../lib/projection');
const _ = require('lodash');

module.exports = function (record, success, fail) {
  const models = record.models;

  const json = record.json;
  if (!json) return fail('no data');
  const data = json.data;
  if (!data) return fail('node data');
  const prop = data.property;
  if (!prop) return fail('node data');
  const lat = prop.latitude;
  const lng = prop.longitude;
  let ll;
  if (lat && lng) ll = projection.BD092GCJ(lat, lng);

  let d = {
    community_id: prop.propertyNo,
    building_count: prop.buildingCount,
    house_count: prop.totalRooms,
    community_complete_year: prop.completeYear,
    avr_price: prop.dealAvgPrice,
    develop_company: prop.devCompany,
    manage_company: prop.mgtCompany,
    plate_id: prop.plateId,
    plate: prop.plateName,
    address: prop.propertyAddress.split(','),
    age: prop.propertyAge,
    community_name: prop.propertyName,
    sell_deal_count: prop.soldCount,
    sell_trading_count: prop.saleTotal,
    rent_trading_count: prop.rentTotal,
    lat_baidu: lat,
    lng_baidu: lng,
    lat: ll ? ll.lat : null,
    lng: ll ? ll.lng : null,
    house_type: prop.houseType,
    green_rate: prop.greenRate
  };

  console.log(d, 'd...');

  // const soldPriceData = data.soldPriceData;
  d = Utils.cleanObjectNull(d);
  // console.log(d);

  models.house_lianjia_community.upsert(d).then(() => {});

  // if(line.house_see_record_info){
  //   var house_see_record_info = line.house_see_record_info;
  //   d.views = house_see_record_info.total_see_count;
  //   d.view_1_month = house_see_record_info.last_month_see_count;
  // }

  return success(null);
};
