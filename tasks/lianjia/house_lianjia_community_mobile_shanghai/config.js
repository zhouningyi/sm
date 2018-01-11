/**
 * 爬取配置
 */
const dblink = require('./../../../lib/dblink');
const Utils = require('./../../../lib/utils');

// const headers = require('./headers');
const _ = require('lodash');

const genURL = id => `http://soa.dooioo.com/api/v4/online/house/xiaoqu/detail?access_token=7poanTTBCymmgE0FOn1oKp&cityCode=sh&client=wap&propertyNo=${id}&sh_access_token=`;

const table_name = 'analysis.house_geo';
module.exports = {
  name: 'house_lianjia_community_mobile_shanghai',
  desc: '上海小区信息汇总',
  version: 2,
  time: {
    type: 'interval',
    value: 2
  },
  urls(cb, db_id) {
    dblink.query(db_id, `
     select community_id from analysis.house_geo
     where address is null
     AND adcode like '31%'
    `)
    .then((ds) => {
      ds = ds.data;
      let id;
      let url;
      const urls = {};
      _.forEach(ds, (d) => {
        id = d.community_id;
        url = genURL(id);
        urls[url] = {
          url
        };
      });
      cb(urls);
    });
  },
  parseType: 'json',
  parallN: 10,
  queryInterval: 100,
  tables: [table_name]
};
