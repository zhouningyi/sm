
  const Gaodefy = require('./../../../lib/gaodefy');
  const _ = require('lodash');
  const dblink = require('./../../../lib/dblink');
  const Utils = require('./../../../utils');
  //
  module.exports = (record, success, fail) => {
    let { json } = record;
    const { tables } = record;
    json = Gaodefy.parseDistrict(json);
    const ds = _.values(json).map(Utils.cleanObjectNull);
    Utils.batchUpsert(tables.areas, ds)
    .then(() => success(null))
    .catch((e) => {
      console.log(e);
      return fail('xx原因');
    });
  };

