/**
 *处理方法
 */
const Utils = require('./../../../lib/utils');
const geojson = require('./../../../lib/geojson');
const gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Models = require('./../../../model');

module.exports = function (record, success, fail) {
  const { params, json, models } = record;
  console.log(json, 'json....');
  if (!json) return fail();
  const poi_list = _.get(json, 'data.poi_list');
  if (poi_list && poi_list.length) {
    const l = poi_list[0];
    const line = {
      ...params,
      adcode: l.adcode,
      unique_id: params.name,
      name_format: l.name,
      lat: parseFloat(l.latitude, 10),
      lng: parseFloat(l.lon, 10)
    };
    models.amap_aomen_washes.upsert(line).then(() => {});
  }
  // const { status } = json;
  // if (status !== '1') {
  //   if (status === '7') record.isable = false;
  //   return fail();// Errors.fast
  // }


  // ////////////////

  // const tip_list = _.get(json, 'data.tip_list');
  // const tips = _.filter(tip_list, (l) => {
  //   const adcode = _.get(l, 'tip.adocde');
  //   return adcode && adcode.startsWith('82');
  // });
  // const tip = _.get(tip_list, '[0].tip');
  // const line = { ...params, unique_id: params.name };

  // if (tip) {
  //   if (tip.adcode.startsWith('82')) {
  //     Object.assign(line, {
  //       name_format: tip.name,
  //       lng: parseFloat(tip.x, 10),
  //       lat: parseFloat(tip.y, 10),
  //       district: tip.district,
  //       adcode: tip.adcode,
  //       category: tip.category
  //     });
  //   } else {
  //     console.log(tip.adcode);
  //   }
  // }
  // models.amap_aomen_washes.upsert(line).then(() => {});

  setTimeout(success, 8000);
};
