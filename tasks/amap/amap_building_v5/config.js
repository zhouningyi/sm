/**
 * 爬取配置
 */
// const Models = require('./../../../../model');
const gaodefy = require('./../../../lib/gaodefy');
const dblink = require('./../../../lib/dblink');

const _ = require('lodash');
const mock = require('./mock');

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
    // const centers = [{
    //   lat: 31.251387,
    //   lng: 121.484826
    // }];
    // const tiles = gaodefy.getTilesFromLatlngs(centers, 18);
    // let t0 = _.values(tiles)[0];
    // t0 = { x: t0[0], y: t0[1], z: t0[2] };
    // const t0 = { x: 219196, y: 107360, z: 18 };
    // const t0 = { z: 18, x: 219645, y: 106828 }; // 上海

    const t0 = { z: 18, x: 218168, y: 106273 }; // 泰州
    // "x": 219137, "y": 107336, "z": 18,
    let { data: ds } = await dblink.queryRaw(db_id, `
      SELECT x, y, z, ${t0.x} - x as dx, ${t0.y} - y as dy, count_est
      FROM amap_tile
      WHERE has_fetch is NULL
      AND count_est IS NOT NULL
      AND abs(${t0.x} - x) < 80
      AND abs(${t0.y} - y) < 80
      ORDER BY count_est DESC
      LIMIT 500
    `);
    ds = [t0].concat(ds);
    const urls = {};
    _.forEach(ds, (d) => {
      const { x, y, z, count_est } = d;
      const depth = 2;
      const { url, tiles } = gaodefy.getUrlBuildingV5(x, y, z, depth);
      urls[url] = { url, params: { x, y, z, tiles, depth } };
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
  //   const tiles = gaodefy.getTilesFromLatlngs(ds, 18);
  //   const depth = 3;
  //   _.values(tiles).forEach((t) => {
  //     const [x, y, z] = t;
  //     url = gaodefy.getUrlBuildingV5(x, y, z, depth);
  //     urls[url] = { url, params: { x, y, z } };
  //     // console.log(url, 'url....');
  //   });
  //   // url = 'https://vdata.amap.com/tiles?mapType=normal&v=3&style=5&rd=1&flds=building&t=18,107996,49570';
  //   // urls[url] = { url };
  //   cb(urls);
  //   // });
  // },
  parseType: 'raw',
  end: {
    type: 'restart',
    isUpdate: true,
  },
  printInterval: 30,
  //
  models: ['amap_building', 'amap_tile', 'amap_tile_poi']
};
