/**
 *处理方法
 */
const Utils = require('./../../utils');
const geojson = require('./../../../../lib/geojson');
const gaodefy = require('./../../../../lib/gaodefy');
const _ = require('lodash');
const Errors = require('./../../../../lib/errors');
const Models = require('./../../../../model');


const checkNull = (o) => {
  for (const k in o) {
    if (Array.isArray(o[k]) && o[k].length === 0) {
      delete o[k];
    }
  }
  return o;
};


module.exports = function (record, success, fail) {
  const json = record.json;

  const status = json.status;
  if (status !== '1') return fail(Errors.fast);

  ds = gaodefy.processRGeoCoderPois(json);
  if (!ds) return fail();
  _.values(ds).forEach((d) => {
    let record = {
      city: '-',
      category_cn: d.category_cn,
      lat: d.lat || d[1],
      lng: d.lng || d[0],
      amap_id: d.amap_id,
      full_name: d.full_name,
      address: d.address,
      adcode: d.adcode
    };
    //
    if (d.c) record.center = geojson.getGeom(d.c, 'Point');
    record = Utils.cleanObjectNull(record);
    checkNull(record);
    if (record) Models.region.upsert(record).then(() => {});
  });

  success();
};
