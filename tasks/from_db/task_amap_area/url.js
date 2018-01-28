
  const Gaodefy = require('./../../../lib/gaodefy');
  const _ = require('lodash');
  const dblink = require('./../../../lib/dblink');
  //
  module.exports = (cb, db_id) => {
    dblink.upsert(db_id, 'public', 'areas', { adcode: '100000', name: '中国', level: 'country' })
    .then(() => {
      dblink.findAll(db_id, 'public', 'areas', { where: { polygon: null } }).then((ds) => {
        const result = {};
        _.forEach(ds.data, (d) => {
          
          const url = Gaodefy.getUrlDistrict(d.name, d.level);
          result[url] = { url, params: { name: d.name } };
        });
        cb(result);
      });
    });
  };;
  