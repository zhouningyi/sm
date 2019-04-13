/**
 * 爬取配置
 */
// const Models = require('./../../../../model');
const gaodefy = require('./../../../lib/gaodefy');

const _ = require('lodash');
const mock = require('./mock');

const adcode = '310000';
const city = '上海市';
// console.log(333);
module.exports = {
  version: 2,
  name: 'amap_building_v5',
  desc: '通过poi点分布，爬取建筑数据',
  parallN: 2,
  queryInterval: 10,
  time: {
    type: 'interval',
    value: 1
  },
  urls(cb) {
    console.log(333);
    process.exit();
    // Models.sequelize
    // .query('SELECT lng, lat FROM amap_poi_geohash_count WHERE poi_n > 200 LIMIT 100')
    // .then((ds) => {
    const ds = mock;
    let name;
    let url;
    var ds = ds[0],
      urls = {};
    const tiles = gaodefy.getTilesFromLatlngs(ds, 17);
    _.values(tiles).forEach((t) => {
      url = gaodefy.getUrlBuildingV5(t[0], t[1], t[2]);
      urls[url] = {
        url
      };
      console.log(url, 'url....');
    });
    cb(urls);
    // });
  },
  parseType: 'json',
  //
  models: ['building']
};
