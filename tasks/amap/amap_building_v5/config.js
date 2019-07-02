/**
 * 爬取配置
 */
// const Models = require('./../../../../model');
const gaodefy = require('./../../../lib/gaodefy');
const dblink = require('./../../../lib/dblink');

const _ = require('lodash');
const mock = require('./mock');


const adcode = '310000';
const city = '上海市';

const seeds = [[109887, 53445, 17]];
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
  urls: async (cb, db_id) => {
    let { data: ds } = await dblink.queryRaw(db_id, `
    SELECT x, y, z 
    FROM amap_tile 
    WHERE has_building IS NULL 
    AND abs(109887 - x) < 1000
    AND abs(53445 - y) < 1000
    ORDER BY random()
    LIMIT 500
    `);
    ds = [{
      x: 109887,
      y: 53445,
      z: 17,
    }].concat(ds);
    const urls = {};
    _.forEach(ds, (d) => {
      const { x, y, z } = d;
      const depth = 2;
      const url = gaodefy.getUrlBuildingV5(x, y, z, depth);
      urls[url] = { url, params: { x, y, z } };
    });
    cb(urls);
  },
  // urls: async (cb, db_id) => {
  //   // const { data: ds } = await dblink.queryRaw(db_id, 'SELECT lng, lat FROM amap_poi_geohash_count WHERE poi_n > 20 LIMIT 1000');

  //   // console.log(data);
  //   // console.log(3333332);
  //   // Models.sequelize
  //   // .query('SELECT lng, lat FROM amap_poi_geohash_count WHERE poi_n > 200 LIMIT 100')
  //   // .then((ds) => {
  //   // const ds = mock;
  //   // let name;
  //   let url;
  //   // ds = ds[0];
  //   const urls = {};
  //   const tiles = gaodefy.getTilesFromLatlngs(ds, 17);
  //   const depth = 3;
  //   _.values(tiles).forEach((t) => {
  //     const [x, y, z] = t;
  //     url = gaodefy.getUrlBuildingV5(x, y, z, depth);
  //     urls[url] = { url, params: { x, y, z } };
  //     // console.log(url, 'url....');
  //   });
  //   // url = 'https://vdata.amap.com/tiles?mapType=normal&v=3&style=5&rd=1&flds=building&t=17,107996,49570';
  //   // urls[url] = { url };
  //   cb(urls);
  //   // });
  // },
  parseType: 'raw',
  end: {
    type: 'restart',
    isUpdate: true,
  },
  //
  models: ['amap_building', 'amap_tile']
};
