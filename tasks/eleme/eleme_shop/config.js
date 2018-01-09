/**
 * 爬取配置
*/

const Models = require('./../../../../model');
const gaodefy = require('./../../../../lib/gaodefy');

const _ = require('lodash');

const getUrl = (d, i) => {
  return `https://mainsite-restapi.ele.me/shopping/restaurants?latitude=${d.lat}&longitude=${d.lng}&limit=200&offset=${i}`;
};

// const sql = `
//   WITH tbs AS (
//     SELECT DISTINCT st_geohash(center, 7) AS geohash FROM regions WHERE adcode LIKE '33%'
//     except
//     SELECT DISTINCT st_geohash(center, 7) AS geohash FROM eleme_shops WHERE district_adcode LIKE '33%'
//   )

//   SELECT
 //    (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 0) :: text :: FLOAT AS lng,
//   (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 1) :: text :: FLOAT AS lat
//   FROM tbs
// `;

const sql = `
  WITH tbs AS (
    SELECT COUNT(1), st_geohash(center, 7) AS geohash 
    FROM regions
    WHERE adcode LIKE '31%'
    GROUP BY st_geohash(center, 7)
  )
  SELECT 
   (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 0) :: text :: FLOAT AS lng,
   (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 1) :: text :: FLOAT AS lat
  FROM tbs
`;

module.exports = {
  name: 'eleme_shop',
  desc: '饿了么商家地址',
  parallN: 2,
  extractN: 500,
  time: {
    type: 'interval',
    value: 1
  },
  headers: {
    'x-shard': () => {
      return `loc=1${Math.floor(Math.random() * 10 + 10)}.94745,28.22948`;
    }
  },
  urls(cb) {
    const urls = {};
    Models.sequelize
    .query(sql)
    .then((ds) => {
      var name,
        url,
        ds = ds[0],
        urls = {};
      ds.forEach((d) => {
        for (let i = 0; i < 1; i++) {
          const url = getUrl(d, i);
          urls[url] = { url };
        }
      });
      cb(urls);
    });
  },
  //
  parseType: 'json',
  printInterval: 10,
  processing: require('./processer'),
  //
  // proxy: 'abu',
  models: ['eleme_shop', 'eleme_shop_history']
};
