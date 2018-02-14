/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');

module.exports = (record, success, fail) => {
  const { json, tables } = record;
  const results = [];
  _.forEach(json.quotes, (v, k) => {
    results.push({
      pair: k,
      source: k.substring(0, 3),
      target: k.substring(3, 6),
      price: v,
      time: new Date()
    });
  });
  Utils.batchUpsert(tables.curreny, results)
  .then(() => success(null))
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
