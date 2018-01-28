/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var _ = require('lodash');
var geojson = require('./../../../../lib/geojson');
var projection = require('./../../../../lib/projection');

module.exports = function(record, success, fail) {
  var Models = record.models;
  const {url, params} = record;
  console.log(url);
  //
  var json = record.json;
  if(!json) return fail();
  var json = json.data;
  if(!json) return fail();

  var data = record.data;

  var lng_baidu = parseFloat(json.baidu_lo, 10), lat_baidu = parseFloat(json.baidu_la, 10);
  var center_baidu = geojson.getGeom([lng_baidu, lat_baidu], 'Point');
  var latlng = projection.BD092GCJ(lat_baidu, lng_baidu);
  var lat = latlng.lat, lng = latlng.lng;
  var center = geojson.getGeom([lng, lat], 'Point');

  function getTrend(ds){
    if(!ds) return null;
    var obj = {};
    ds.forEach(function(d){
      obj[d.year_month] = parseInt(d.sign_price, 10);
    });
    return obj;
  }

  var price_trend_sell = json.ershoufang_market_info? getTrend(json.ershoufang_market_info.price_trend_room_all): null;
  var price_trend_rent = json.chuzufang_market_info ? getTrend(json.chuzufang_market_info.price_trend_room_all):  null;
  var property_address = json.property_address ? json.property_address.split(',') : null
  var plate_id = json.bizcircle_id?json.bizcircle_id.toString(): null;
  var last_month_info = json.ershoufang_market_info.last_month_info;
  var avr_price = last_month_info? parseInt(last_month_info.avg_unit_price, 10) : null;
  
  const community_id = json.community_id || data.community_id;
  const {community_name} = json;
  let item = {
     community_id,
     community_name,
     community_complete_year: json.building_finish_year,
     building_count: json.building_total_count,
     house_count: json.house_total_count,
     building_density: json.plot_ratio,
     green_rate: Math.floor(json.greening_rate * 100) || 0,
     building_type: json.building_type,
     lng_baidu: lng_baidu,
     lat_baidu: lat_baidu,
     center_baidu: center_baidu,
     house_type: json.house_type,
     lng: lng,
     lat: lat,
     center: center,
     address: property_address,
     community_url_mobile: json.m_url,
     sell_deal_count: json.ershoufang_deal_count,
     sell_trading_count: json.ershoufang_source_count,
     rent_deal_count: json.chuzufang_deal_count,
     rent_trading_count: json.chuzufang_source_count,
     // price_trend_sell: price_trend_sell,
     // price_trend_rent: price_trend_rent,
     site: json.bizcircle_name,
     plate_id: plate_id,
     avr_price: avr_price
  };

  console.log(json.house_type, json.name, item.building_density);

  item = Utils.cleanObjectNull(item);

  Models.house_lianjia_community.upsert(item);

  _.forEach(price_trend_sell, (price, month) => {
    Models.house_lianjia_community_status_history_lianjia.upsert({
      community_id, community_name,
      time: month, avg_price_sell: price
    });
  });
  _.forEach(price_trend_rent, (price, month) => {
    Models.house_lianjia_community_status_history_lianjia.upsert({
      community_id, community_name,
      time: month, avg_price_rent: price
    });
  });

  json.agent && json.agent.forEach && json.agent.forEach(function(a){
    if (!a || Array.isArray(a)) return;
    a.adcode = params.adcode;
    Models.agent_info.upsert(a).then(function(){});
  });

  return success(null);
};