/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');

module.exports = (record, success, fail) => {
  const { $, json, tables } = record;
  console.log(json, 'json....');
  process.exit();
  const results = [];
  _.forEach(json, (v, k) => {

  });
  Utils.batchUpsert(tables.digital_coin, results)
  .then(() => success(null))
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
