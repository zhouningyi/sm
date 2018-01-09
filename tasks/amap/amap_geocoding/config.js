/**
 * 爬取配置
 */
const Models = require('./../../../../model');
const gaodefy = require('./../../../../lib/gaodefy');

const _ = require('lodash');

// 通过已有的poi点 推测geohash，以其中心点经纬度展开搜索
// 运行爬虫前，确保regions表有数据 且运行过 sql/amap/update_geohash_from_pois.sql
module.exports = {
  version: 2,
  name: 'amap_geocoding',
  desc: '通过高德geocoding获取poi点',
  parallN: 50,
  queryInterval: 5,
  urls(cb) {
    Models.sequelize
    .query(`
      SELECT lat, lng FROM amap_poi_geohash_count WHERE poi_n > 5;
    `)
    .then((ds) => {
      let name,
        url;
      ds = ds[0];
      const urls = {};
      const r = 800;
      ds.forEach((d) => {
        name = d.name;
        url = gaodefy.getUrlRGeoCoder(d.lat, d.lng, r);
        urls[url] = {
          url
        };
      });
      cb(urls);
    });
  },
  time: {
    type: 'interval',
    value: 7,
  },
  //
  parseType: 'json',
  processing: require('./processer'),
  //
  models: ['region']
};
