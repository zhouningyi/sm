/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var geojson = require('./../../../../lib/geojson');
var gaodefy = require('./../../../../lib/gaodefy');
var _ = require('lodash');
var Errors = require('./../../../../lib/errors');
var Models = require('./../../../../model');

module.exports = function (record, success, fail) {
  var json = record.json;
  if(!json) return fail();
  var params = record.params;

  var status = json.status;
  if (status !== '1'){
    if(status === '7') record.isable = false;
    return fail();//Errors.fast
  }

  ds = gaodefy.processSearchQuik(json);
  if (!ds) return fail();

  var result = record.result = [];
  _.values(ds).forEach(function (d) {
    var record = {
      city: '-',
      category: d.category,
      district: d.district,
      lat:  d.lat || d[1],
      lng: d.lng || d[0],
      amap_id: d.amap_id,
      full_name: d.full_name,
      address: d.address,
      adcode: d.adcode
    };
    //
    if(d.c) record.center = geojson.getGeom(d.c, 'Point');
    record = Utils.cleanObjectNull(record);
    //
    Models.region.upsert(record).then(function(){});
  });

  success();
};
