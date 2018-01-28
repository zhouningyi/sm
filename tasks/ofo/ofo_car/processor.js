/**
* @Author: disoul
* @Date:   2017-04-27T22:39:33+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-26T13:27:44+08:00
*/

/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var _ = require('lodash');

var Gaodefy = require('./../../../../lib/gaodefy');
var geojson = require('./../../../../lib/geojson');

const {floor} = Math;

const carUpsert = (datas) => {
  let values = [];
  _.uniq(datas, (d) => d.car_id).forEach(d => {
    values.push(`('${d.car_id}', '${d.ordernum}', ${d.lat}, ${d.lng}, st_setsrid(ST_GeomFromGeoJSON('${JSON.stringify(d.center)}'), 4326), now(), now())`);
  });
  return `
  INSERT INTO public.ofo_cars ( car_id, ordernum, lat, lng, center, "createdAt", "updatedAt" )
  VALUES ${values.join(',')}
  ON CONFLICT (car_id) DO UPDATE SET ordernum = EXCLUDED.ordernum,
  lat = EXCLUDED.lat, lng = EXCLUDED.lng, center = EXCLUDED.center,
  "createdAt" = public.ofo_cars."createdAt", "updatedAt" = EXCLUDED."updatedAt";
  `;
}

const historyUpsert = (datas) => {
  let values = [];
  _.uniq(datas, (d) => d.car_id).forEach(d => {
    values.push(`('${d.unique_id}', '${d.car_id}', now(), ${d.lat}, ${d.lng}, st_setsrid(ST_GeomFromGeoJSON('${JSON.stringify(d.center)}'), 4326), now(), now())`);
  });
  return `
  INSERT INTO public.ofo_car_histories ( unique_id, car_id, time, lat, lng, center, "createdAt", "updatedAt" )
  VALUES ${values.join(',')}
  ON CONFLICT (unique_id) DO UPDATE SET unique_id = EXCLUDED.unique_id, time = EXCLUDED.time,
  lat = EXCLUDED.lat, lng = EXCLUDED.lng, center = EXCLUDED.center,
  "createdAt" = public.ofo_car_histories."createdAt", "updatedAt" = EXCLUDED."updatedAt";
  `;
}

const userUpsert = (datas) => {
  let values = [];
  _.uniq(datas, (d) => d.user_id).forEach(d => {
    values.push(`('${d.user_id}', now(), now())`);
  });
  return `
  INSERT INTO public.ofo_users ( user_id, "createdAt", "updatedAt" )
  VALUES ${values.join(',')}
  ON CONFLICT (user_id) DO UPDATE SET
  "createdAt" = public.ofo_users."createdAt", "updatedAt" = EXCLUDED."updatedAt";
  `;
}

module.exports = function (record, success, fail) {
  var json = record.json;
  var Models = record.models;
  var result = {};
  console.log(json);
  if(!json) return console.log('无数据');
  if(!json.errorCode == '200') return console.log('反常');
  if(!json.values) return console.log('no json.values');
  if(!json.values.info) return console.log('no json.values.info');
  if(!json.values.info.cars || !json.values.info.cars.length) return;
  let promiseQuery = [];
  let items = [];
  let users = [];
  let cars = [];
  json.values.info.cars.forEach((d) => {
  	const car_id = d.carno;
  	const {lat, lng, ordernum} = d;
  	const time = new Date();
  	const center = geojson.getGeom([lng, lat], 'Point');
    const unique_id = [car_id, Math.floor(lat * 100000), Math.floor(lng * 100000)].join('_');
  	const item = {car_id, unique_id, lat, lng, time, center};
  	const user_id  = d.userIdLast;
    items.push(item);
    users.push({user_id});
    cars.push({car_id, ordernum, center, lat, lng});
  	// promiseQuery.push(Models.ofo_car_history.upsert(item));
  	// promiseQuery.push(Models.ofo_user.upsert({user_id}));
    // promiseQuery.push(Models.ofo_car.upsert({car_id, ordernum, center, lat, lng}));
  });
  promiseQuery.push(Models.ofo_car.sequelize.query(carUpsert(cars)));
  promiseQuery.push(Models.ofo_car_history.sequelize.query(historyUpsert(items)));
  // promiseQuery.push(Models.ofo_user.sequelize.query(userUpsert(users)));

  // console.log('promisequery length', promiseQuery.length);
  Promise.all(promiseQuery).then(() => {
    // console.log('promiseQuery success');
    success();
  }).catch(e => {
    // console.log('promiseQuery fail', e);
    fail(e);
  });
};
