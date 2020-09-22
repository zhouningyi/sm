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

const key = '46799a1920f8b8914ad7d0a2db0096d1';
function getUrlRGeoCoder(lat, lng, r) {
  const radiusQ = r ? (`&extensions=all&radius=${r}`) : '';
  return `${'http://restapi.amap.com/v3/geocode/regeo?' +
 'key='}${key}&s=rsv3${radiusQ}&location=${lng},${lat}`;
}


module.exports = {
  version: 2,
  name: 'amap_r_geocodings',
  desc: '反向地理编码',
  parallN: 2,
  queryInterval: 10,
  time: {
    type: 'interval',
    value: 1
  },
  urls: async (cb, db_id) => {
    const { data: ds } = await dblink.queryRaw(db_id, `
    SELECT unique_id, lat, lng FROM amap_building 
    WHERE lng > 120.1 AND lng < 123
    AND lat > 30.1 AND lat < 32
    AND town IS NULL
    `);
    const urls = {};
    _.forEach(ds, (d) => {
      const url = getUrlRGeoCoder(d.lat, d.lng, 200);
      urls[url] = { url, params: { ...d } };
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
  parseType: 'json',
  end: {
    type: 'restart',
    isUpdate: true,
  },
  //
  models: ['amap_building']
};
