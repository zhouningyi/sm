/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');

const Gaodefy = require('./../../../../lib/gaodefy');
const geojson = require('./../../../../lib/geojson');

const {floor} = Math;

module.exports = function (record, success, fail) {
  const {json} = record;
  const Models = record.models;
  const result = {};
  if(!json) return console.log('无数据...');
  if(!json.object) return console.log('no json.values');
  console.log(json.object.length, '数量...', json.object[0].distance);
  json.object.forEach(d => {
  	const car_id = d.distId;
    const lng = d.distX;
    const lat = d.distY;
    const {bike_type, distance} = d;
  	const time = new Date();
  	const center = geojson.getGeom([lng, lat], 'Point');
    const unique_id = [car_id, Math.floor(lat * 100000), Math.floor(lng * 100000)].join('_');
    const hongbao_type = d.type;
  	const item = {unique_id, lat, lng, time, center, bike_type, car_id, hongbao_type, distance};
  	Models.mobike_car_history.upsert(item);
  	Models.mobike_car.upsert({car_id, bike_type, lat, lng, center, hongbao_type, distance});
  })

  return success(null);
};
