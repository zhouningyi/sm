/**
* @Author: disoul
* @Date:   2017-05-18T15:46:26+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-26T14:31:35+08:00
*/



/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');
const _ = require('lodash');

const Gaodefy = require('./../../../../lib/gaodefy');
const geojson = require('./../../../../lib/geojson');

const {floor} = Math;

const historyUpsert = (datas) => {
  let values = [];
  _.uniq(datas, (d) => d.car_id).forEach(d => {
    values.push(`('${d.unique_id}', '${d.car_id}', now(), ${d.lat}, ${d.lng}, st_setsrid(ST_GeomFromGeoJSON('${JSON.stringify(d.center)}'), 4326), '${d.bike_type}', ${d.distance}, now(), now())`);
  });
  return `
  INSERT INTO public.mobike_car_fast_histories ( unique_id, car_id, time, lat, lng, center, bike_type, distance, "createdAt", "updatedAt" )
  VALUES ${values.join(',')}
  ON CONFLICT (unique_id) DO UPDATE SET car_id = EXCLUDED.car_id, time = EXCLUDED.time,
  lat = EXCLUDED.lat, lng = EXCLUDED.lng, center = EXCLUDED.center,
  bike_type = EXCLUDED.bike_type, distance = EXCLUDED.distance,
  "createdAt" = public.mobike_car_fast_histories."createdAt", "updatedAt" = EXCLUDED."updatedAt";
  `;
}

const carUpsert = (datas) => {
  let values = [];
  _.uniq(datas, (d) => d.car_id).forEach(d => {
    values.push(`('${d.car_id}', '${d.bike_type}', ${d.lat}, ${d.lng}, ${d.distance}, '${d.hongbao_type}', '${d.district_adcode}', st_setsrid(ST_GeomFromGeoJSON('${JSON.stringify(d.center)}'), 4326), now(), now())`);
  });
  return `
  INSERT INTO public.mobike_car_fasts ( car_id, bike_type, lat, lng, distance, hongbao_type, district_adcode, center, "createdAt", "updatedAt" )
  VALUES ${values.join(',')}
  ON CONFLICT (car_id) DO UPDATE SET bike_type = EXCLUDED.bike_type,
  lat = EXCLUDED.lat, lng = EXCLUDED.lng, center = EXCLUDED.center,
  distance = EXCLUDED.distance, hongbao_type = EXCLUDED.hongbao_type, district_adcode = EXCLUDED.district_adcode,
  "createdAt" = public.mobike_car_fasts."createdAt", "updatedAt" = EXCLUDED."updatedAt";
  `;
}


module.exports = function (record, success, fail) {
  const {json} = record;
  const Models = record.models;
  const result = {};
  if(!json) return console.log('无数据...');
  if(!json.object) return console.log('no json.values');
  console.log(json.object.length, '数量...', json.object[0].distance);
  let items = [];
  let cars = [];
  let promiseQuery = [];
  json.object.forEach(d => {
  	const car_id = d.distId;
    const lng = d.distX;
    const lat = d.distY;
    const {biketype, distance} = d;
  	const time = new Date();
  	const center = geojson.getGeom([lng, lat], 'Point');
    const unique_id = [car_id, Math.floor(lat * 100000), Math.floor(lng * 100000)].join('_');
    const hongbao_type = d.type;
  	const item = {unique_id, lat, lng, time, center, bike_type: biketype, car_id, hongbao_type, distance};
    items.push(item);
    cars.push({car_id, bike_type: biketype, lat, lng, center, hongbao_type, distance});
  	// Models.mobike_car_fast_history.upsert(item);
  	// Models.mobike_car_fast.upsert({car_id, bike_type: biketype, lat, lng, center, hongbao_type, distance});
  });

  promiseQuery.push(Models.mobike_car_fast.sequelize.query(carUpsert(cars)));
  promiseQuery.push(Models.mobike_car_fast.sequelize.query(historyUpsert(items)));

  console.log('promisequery length', promiseQuery.length);
  Promise.all(promiseQuery).then(() => {
    console.log('promiseQuery success');
    success();
  }).catch(e => {
    console.log('promiseQuery fail', e);
    fail(e);
  });

  return success(null);
};
