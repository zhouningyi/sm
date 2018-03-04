/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');
const md5 = require('md5');


module.exports = (record, success, fail) => {
  const { json } = record;
  const { tables } = record;
  const ds = _.get(json, 'data.content');
  const results = _.map(ds, d => ({
    unique_id: md5(`${d.url}_${d.time}`),
    url: d.link,
    title: d.title,
    time: new Date(d.time * 1000),
    type: d.type
  }));
  Utils.batchUpsert(tables.aicoin_quicknews, results)
  .then(() => success(null))
  .catch((e) => {
    // console.log(e.sql);
    return fail('xx原因');
  });
};
