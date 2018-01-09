/**
 * 爬取配置
 */
const Models = require('./../../../../model');
const gaodefy = require('./../../../../lib/gaodefy');

const _ = require('lodash');

const adcode = '310000';
const city = '上海市';

module.exports = {
  version: 2,
  name: 'amap_building',
  desc: '通过poi点分布，爬取建筑数据',
  parallN: 2,
  queryInterval: 10,
  time: {
    type: 'interval',
    value: 1
  },
  urls(cb) {
    Models.sequelize
    .query('SELECT lng, lat FROM amap_poi_geohash_count WHERE poi_n > 2')
    .then((ds) => {
      var name,
        url,
        ds = ds[0],
        urls = {};
      const tiles = gaodefy.getTilesFromLatlngs(ds, 17);
      _.values(tiles).forEach((t) => {
        url = gaodefy.getUrlBuilding(t[0], t[1], t[2]);
        urls[url] = {
          url
        };
      });
      cb(urls);
    });
  },
  parseType: 'json',
  processing: require('./processer'),
  //
  models: ['building']
};
