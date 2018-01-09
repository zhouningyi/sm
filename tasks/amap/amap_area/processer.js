/**
 *处理方法
 */
const Gaodefy = require('./../../../lib/gaodefy');
const Utils = require('./../../../utils');
const _ = require('lodash');

module.exports = (record, success, fail) => {
  let { json } = record;
  const { tables } = record;
  json = Gaodefy.parseDistrict(json);
  const ds = _.values(json);
  Utils.batchUpsert(tables.areas, ds).then(() => success(null)).catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
