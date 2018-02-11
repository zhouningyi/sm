/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');
const geojson = require('./../../../../lib/geojson');
const gaodefy = require('./../../../../lib/gaodefy');
const _ = require('lodash');
const Errors = require('./../../../../lib/errors');
const Models = require('./../../../../model');

module.exports = function (record, success, fail) {
  const json = record.json;
  if (!json) return fail();
  const params = record.params;

  const status = json.status;
  if (status !== '1') {
    if (status === '7') record.isable = false;
    return fail();// Errors.fast
  }

  ds = gaodefy.processSearchQuik(json);
  if (!ds) return fail();

  const result = record.result = [];
  _.values(ds).forEach((d) => {
    let record = {
      city: '-',
      category: d.category,
      district: d.district,
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
    //
    Models.region.upsert(record).then(() => {});
  });

  success();
};
