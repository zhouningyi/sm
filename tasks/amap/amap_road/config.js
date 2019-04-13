/**
 * 爬取配置
 */
const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const dblink = require('./../../../lib/dblink');

function getURL(source, target) {
  const key = '767b3f050b17f8c713e3835b18f57ff9';
  return `https://restapi.amap.com/v3/direction/driving?origin=${source.lng},${source.lat}&destination=${target.lng},${target.lat}&output=json&key=${key}`;
}

module.exports = {
  name: 'amap_road',
  desc: '道路信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    const urls = {};
    const sql = `
      SELECT 
        count,
        (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 0) :: text :: FLOAT AS lng,
        (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 1) :: text :: FLOAT AS lat
      FROM (
        SELECT 
          count(1), 
          st_geohash(center, 6) AS geohash
        FROM regions
        WHERE adcode LIKE '3202%'
        GROUP BY st_geohash(center, 6)
      ) AS t
      WHERE count > 10
      ORDER BY count DESC;
    `;

    dblink.query(db_id, sql).then((ds) => {
      const { data } = ds;
      for (let i = 0; i < data.length; i++) {
        const l1 = data[i];
        for (let j = i + 1; j < data.length; j++) {
          const l2 = data[j];
          const url = getURL(l1, l2);
          urls[url] = { url };
        }
      }
      cb(urls);
    });
  },
  parseType: 'json',
  periodInterval: 1000,
  models: ['road'],
  printInterval: 30,
  //
  parallN: 3,
};
