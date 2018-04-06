/**
 *处理方法
 */
const dbUtils = require('./../../../lib/dblink/utils');
const Utils = require('./../../../lib/utils');
const _ = require('lodash');
const md5 = require('md5');

module.exports = (record, success, fail) => {
  const { tables, json, body, params } = record;
  const ds = _.get(json, 'data.content');
  const results = _.map(ds, (d) => {
    let source = Utils.cut(d.title, '【', '】');
    source = Utils.trim(source);
    source = source.split('】')[0];
    return {
      unique_id: md5(`${d.url}_${d.time}`),
      url: d.link,
      title: d.title,
      time: new Date(d.time * 1000),
      type: d.type,
      source,
      lastid: params.lastid
    };
  });
  console.log(results.length, 'results...');
  dbUtils.batchUpsert(tables.aicoin_quicknews, results)
  .then(() => {
    success(null);
  })
  .catch((e) => {
    return fail('xx原因');
  });
};
