/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const Models = require('./../../../../model');
// const headers = require('./headers');
const _ = require('lodash');

const genURL = id => `http://soa.dooioo.com/api/v4/online/house/xiaoqu/detail?access_token=7poanTTBCymmgE0FOn1oKp&cityCode=sh&client=wap&propertyNo=${id}&sh_access_token=`;

module.exports = {
  name: 'house_lianjia_community_mobile_shanghai',
  desc: '上海小区信息汇总',
  // headers: headers,
  version: 2,
  time: {
    type: 'interval',
    value: 2
  },
  urls(cb) {
    Models.sequelize.query(`
      SELECT community_id
      FROM house_lianjia_communities
      WHERE adcode LIKE '31%'
    `)
    .then((ds) => {
      let id;
      let url;
      const urls = {};
      _.forEach(ds[0], (d) => {
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
  processing: require('./processer'),
  parallN: 10,
  queryInterval: 100,
  models: ['house_lianjia_community']
};
