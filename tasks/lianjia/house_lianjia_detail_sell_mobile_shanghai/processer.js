/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var _ = require('lodash');

module.exports = function(record, success, fail) {
  var Model = record.models.house_lianjia_detail;

  const {json} = record;
  if (!json) return fail();
  var propertySold = json.propertySold;
  if (!propertySold) return fail();
  const { houseSell } = json;
  if (!houseSell) return fail();
  
  var data = record.params;

  var line = {};
  if(propertySold.pageList && propertySold.pageList[0]){
    line = propertySold.pageList[0];
  }

  var sellStatus = 'selling';
  if (houseSell.putAway === 0) {
    sellStatus = 'offline';
  } else if (houseSell.putAway === 2) {
    sellStatus = 'sold';
  }

  var trade_date_start 
  if(line.soldDate){
    trade_date_start = new Date(line.soldDate);
  }
  
  var trade_date_start_online;
  if(houseSell.onlineTime){
    trade_date_start_online = new Date(houseSell.onlineTime);
  }

  var trade_date_last;
  if(houseSell.buyTimeString){
    trade_date_last = new Date(houseSell.buyTimeString);
  }

  var tags;
  if(houseSell.tags){
    tags = houseSell.tags.split(',');
  }
console.log(houseSell.lookCount90,  houseSell.lookCount7);
  var d = {
    building_complete_year: line.buildingYear,
    house_type: line.houseType,
    trade_type: 'sell',
    status: sellStatus,
    decoration: line.decoration,
    house_direction: line.face,
    trade_id: `${houseSell.id}`,
    title: line.title,
    trade_date_last: trade_date_last,
    trade_date_start: trade_date_start,
    trade_date_start_online: trade_date_start_online,
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
    loan_first_time: houseSell.firstPay * 10000 ,
    loan_per_month: houseSell.monthPay
  };

  d = Utils.cleanObjectNull(d);
  // console.log(d);

  // console.log(d);

  Model.upsert(d).then(function() {});

  return success(null);
};
