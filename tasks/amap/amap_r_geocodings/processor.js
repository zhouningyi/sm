/**
 *处理方法
 */
// const Utils = require('./../../../utils');
const geojson = require('./../../../lib/geojson');
const gaodefy = require('./../../../lib/gaodefy');
const Utils = require('./../../../lib/dblink/utils');

const md5 = require('md5');
const _ = require('lodash');
// const Errors = require('./../../../lib/errors');
// const Models = require('./../../../model');

function formater(v) {
  if (!v) return null;
  if (Array.isArray(v) && !v.length) return null;
  return v;
}

module.exports = async (record, success, fail) => {
  const { body, json, models, params, url } = record;
  if (!body) return fail('无数据');
  const { status } = json;
  if (status !== '1') {
    fail('返回不正确');
  } else {
    try {
      const addressComponent = _.get(json, 'regeocode.addressComponent');
      const address = formater(_.get(json, 'regeocode.formatted_address')) || '-';
      const line = {
        unique_id: params.unique_id,
        adcode: formater(_.get(addressComponent, 'adcode')),
        town: formater(_.get(addressComponent, 'township')),
        town_code: formater(_.get(addressComponent, 'township')),
        name: formater(_.get(addressComponent, 'building.name')),
        type: formater(_.get(addressComponent, 'building.type')),
        address
      };
      await Utils.batchUpsert(models.amap_building, [line]);
      success();
    } catch (e) {
      fail('解析错误');
    }
  }
};
