/**
 *处理方法
 */
const Utils = require('./../../../lib/utils');
const dUtils = require('./../../../lib/dblink/utils');
const _ = require('lodash');
const geojson = require('./../../../lib/geojson');
const projection = require('./../../../lib/projection');

const parseLatlngs = (str) => {
  return str.split(';').map((pair) => {
    pair = pair.split(',').map(d => parseFloat(d, 10));
    const ll = projection.BD092GCJ(pair[1], pair[0]);
    return [ll.lng, ll.lat];
  });
};

module.exports = async function (record, success, fail) {
  const { house_lianjia_plates } = record.models;
  //
  const ds = record.script;
  if (!ds) return fail('no scripts...');
  for (let i = 0; i < ds.length; i++) {
    let d = ds[i];
    d = Utils.cut(d, '({', '})');
    try {
      d = JSON.parse(d);
    } catch (e) {
      console.log(e);
    }
    let idx = 0;
    const results = _.map(_.get(d, 'data.list'), ((line, plate_id) => {
      idx++;
      const { border, count: selling_count, latitude: lat, longitude: lng, name, unit_price: avg_price } = line;
      let c = projection.BD092GCJ(parseFloat(lat, 10), parseFloat(lng, 10));
      c = [c.lng, c.lat];
      const coords = parseLatlngs(border);
      return {
        name,
        plate_id,
        lat: c[1],
        lng: c[0],
        center: geojson.getGeom(c, 'Point'),
        polygon: geojson.getGeom([coords], 'Polygon'),
        avg_price,
        selling_count,
      };
    }));
    console.log(`${idx}条数据....`);
    //
    try {
      await dUtils.batchUpsert(house_lianjia_plates, results);
    } catch (e) {
      console.log(e);
    }
  }
  success(null);
  return null;
};
