/**
 *处理方法
 */
const Utils = require('./../../utils');
const geojson = require('./../../../../lib/geojson');
const gaodefy = require('./../../../../lib/gaodefy');
const _ = require('lodash');
const Errors = require('./../../../../lib/errors');
const Models = require('./../../../../model');

module.exports = (record, success, fail) => {
  const json = record.json;
  const data = record.data;

  const status = json.status;
  if (status !== 1) { // 这个区域没有数据
    record.isable = false;
    return fail('status error');
  }

  ds = gaodefy.processBuilding(json);
  if (!ds) {
    record.isable = false;
    return fail('node data');
  }

  const result = record.result = [];
  ds.forEach((d) => {
    let record = {
      x: d.x,
      y: d.y,
      z: d.z,
      name: d.name,
      floor: d.floor,
      lat: d.lat,
      lng: d.lng,
      mock_id: `${d.x}_${d.y}_${d.z}${d.name}_${d.floor}_${d.lat.toFixed(5)}_${d.lng.toFixed(5)}`
    };
    //
    if (d.polygon) record.polygon = geojson.getGeom(d.polygon, 'Polygon');
    if (d.c) record.center = geojson.getGeom(d.c, 'Point');
    record = Utils.cleanObjectNull(record);
    //
    Models.building.upsert(record).then(() => {});
  });

  success();
};
