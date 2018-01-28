/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var gaodefy = require('./../../../../lib/gaodefy');
var geojson = require('./../../../../lib/geojson');
var _ = require('lodash');

module.exports = (record, success, fail) => {
    const {json, data, params} = record;
    var Models = record.models;
    if(!json) return fail('no json...');
    var ds = gaodefy.processSearch(json);
    if (!ds) {
      console.log('fail to geocode', data)
      return fail();
    }

  _.values(ds).forEach(d => {
    let rec = {
      road_name: d.fullName,
      adcode: d.adcode,
      amap_id: d.id,
      newtype: d.newtype,
      amap_category: d.newtype,
    };
    if(d.newtype != '190301') return;
    const {domain_list} = d;
    if(!domain_list) {
      if (d.polygon) {
         rec.polygon = geojson.getGeom(d.polygon, 'MultiPolygon');
         Models.amap_loop.upsert(rec).then(() => {});
      }
    } else {
      domain_list.forEach( dm => {
        const {value} = dm;
        if(!value) return;
        const polygon = gaodefy.getBound(value)
        rec.polygon = geojson.getGeom(polygon, 'MultiPolygon');
        Models.amap_loop.upsert(rec).then(() => {});
      });
    }
  });
    success(null);
  };
