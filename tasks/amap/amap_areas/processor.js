/**
 *处理方法
 */
const Gaodefy = require('./../../../lib/gaodefy');
const Utils = require('./../../../utils');
const _ = require('lodash');

module.exports = async (record, success, fail) => {
  let { json } = record;
  const { tables } = record;
  json = Gaodefy.parseDistrict(json);
  const ds = _.values(json).map(Utils.cleanObjectNull);
  // _.forEach(ds, d => console.log(d.center));

  for (const i in ds) {
    const d = ds[i];
    // console.log(d, tables.areas, 'd...');
    await tables.areas.upsert(d)
    .then(() => success(null))
    .catch((e) => {
      console.log(e);
      return fail('xx原因');
    });
  }
};
