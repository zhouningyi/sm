/**
 *处理方法
 */
var Utils = require('./../../../../lib/utils');
var gaodefy = require('./../../../../lib/gaodefy');
var geojson = require('./../../../../lib/geojson');
var _ = require('lodash');

module.exports = function (record, success, fail) {
    const {json, data, params} = record;
    var Models = record.models;
    if(!json) return fail('no json...');
    var ds = gaodefy.processSearch(json);
    if (!ds) {
      console.log('fail to geocode', data)
      return fail();
    }

  _.values(ds).forEach(function (d) {
    let rec = {
      full_name: d.fullName,
      adcode: d.adcode,
      amap_id: d.id,
      city: d.city,
      district: d.district,
      newtype: d.newtype,
      gaode_newtype: d.newtype,
      typecode: d.typecode,
      community_id_lianjia: params.community_id,
      community_id: params.community_id
    };
    const recCom = _.cloneDeep(rec);
    //
    if (d.polygon) {
      const {lat, lng} = params;
      const latp = d.lat || d.polygon[0][0][1];
      const lngp = d.lng || d.polygon[0][0][0];
      const dist = Math.sqrt(Math.pow(latp - lat, 2) + Math.pow(lngp - lng, 2));
      const {newtype} = d;
      if (dist < 0.05 && newtype && (newtype.indexOf('1203') !== -1 || newtype.indexOf('1904') !== -1)){
        recCom.latlngs = recCom.polygon = geojson.getGeom(d.polygon, 'Polygon');
      } 
       rec.latlngs = rec.polygon = geojson.getGeom(d.polygon, 'Polygon');
    }
    // if (d.center && !params.lat) recCom.center = geojson.getGeom(d.center, 'Point');
    Models.region.upsert(rec).then(() => {});
    Models.house_lianjia_community.upsert(recCom).then(() => {});
  });
    success(null);
  };
