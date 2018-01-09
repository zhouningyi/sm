/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var _ = require('lodash');
var geojson = require('./../../../../lib/geojson');
var projection = require('lmap/core/projection');

const parseLatlngs = (str) => {
  return str.split(';').map(pair => {
    pair = pair.split(',').map(d => parseFloat(d, 10));
    let ll =  projection.BD092GCJ(pair[1], pair[0]);
    return [ll.lng, ll.lat];
  });
}

module.exports = function(record, success, fail) {
  const model = record.models.house_lianjia_plate;
  //
  let json = record.json;
  if(!json) return fail('no json...');
  let ds = json.data;
  if (!ds || !ds.length) return fail('no length...');

  ds.forEach((d) => {
    let c = projection.BD092GCJ(parseFloat(d.latitude, 10), parseFloat(d.longitude, 10));
    c = [c.lng, c.lat];

    let coords = parseLatlngs(d.position_border);
    let result = {
      plate_id: '' + d.id,
      name: d.name,
      lat: c[1], 
      lng: c[0], 
      center: geojson.getGeom(c, 'Point'),
      polygon: geojson.getGeom([coords], 'Polygon'),
      avg_price: d.avg_unit_price,
      selling_count: d.house_count
    };
    Utils.upsertPg(model, result);
  });

  return success(null);
};