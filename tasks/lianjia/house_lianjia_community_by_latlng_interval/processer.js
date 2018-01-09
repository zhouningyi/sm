/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var _ = require('lodash');
var projection = require('./../../../../lib/projection');

module.exports = function(record, success, fail) {
  //
  let {json, models} = record;
  if(!json) return fail('no json...');
  let ds = json.data;
  if (!ds || !ds.length) return fail('no data length...');

  ds.forEach(d => {
    const lng = parseFloat(d.longitude, 10);
    const lat = parseFloat(d.latitude, 10);
    let ll;
    if (lat && lng) ll = projection.BD092GCJ(lat, lng);
    let item = {
      community_name: d.name,
      community_id: d.id,
      lat: ll ? ll.lat : null,
      lng: ll ? ll.lng : null,
      avr_price: d.avg_unit_price
    };
    item = Utils.cleanObjectNull(item);
    models.house_lianjia_community.upsert(item);
  });

  return success(null);
};