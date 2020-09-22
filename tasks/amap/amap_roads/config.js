/**
 * 爬取配置
 */
const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const dblink = require('./../../../lib/dblink');

const latlngs = require('./latlngs.json');

function getURL(source, target) {
  const key = '767b3f050b17f8c713e3835b18f57ff9';
  return `https://restapi.amap.com/v3/direction/driving?origin=${source.lng},${source.lat}&destination=${target.lng},${target.lat}&output=json&key=${key}`;
}

module.exports = {
  name: 'amap_roads',
  desc: '道路信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    const urls = {};
    //
    // const sql = `
    //   SELECT
    //     count,
    //     (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 0) :: text :: FLOAT AS lng,
    //     (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 1) :: text :: FLOAT AS lat
    //   FROM (
    //     SELECT
    //       count(1),
    //       st_geohash(center, 6) AS geohash
    //     FROM regions
    //     WHERE adcode LIKE '8200%'
    //     GROUP BY st_geohash(center, 6)
    //   ) AS t
    //   WHERE count > 2
    //   ORDER BY count DESC;
    // `;
// 119°38′——120°33′ 31.236-32.611
    const sql = `
    SELECT 
      count,
      (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 0) :: text :: FLOAT AS lng,
      (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 1) :: text :: FLOAT AS lat
    FROM (
      SELECT 
        count(1), 
        st_geohash(poi.center, 6) AS geohash
      FROM (
        SELECT (((st_asgeojson(center)::json) -> 'coordinates') -> 0)::text::FLOAT as lng,
        (((st_asgeojson(center)::json) -> 'coordinates') -> 1)::text::FLOAT as lat,
        center
        FROM amap_tile_poi
      ) AS poi
      WHERE lat > 31.23
      AND lat < 32.6
      AND lng > 119.5
      AND lng < 120.5
      GROUP BY st_geohash(poi.center, 6)
    ) AS t
    WHERE count > 50
    ORDER BY count DESC;
  `;

    // dblink.query(db_id, sql).then((ds) => {
      // const { data } = ds;
    const data = latlngs;
    const p = 0.002;
    for (let i = 0; i < data.length; i++) {
      const l1 = data[i];
      if (Math.random() > p) continue;
      for (let j = i + 1; j < data.length; j++) {
        if (Math.random() > p) continue;
        const l2 = data[j];
        const url = getURL(l1, l2);
        // if (Math.random() < 0.1)
        urls[url] = { url };
      }
    }
    console.log(`${_.values(urls).length}条url...`);
    cb(urls);
    // });
  },
  parseType: 'json',
  periodInterval: 1000,
  models: ['road'],
  printInterval: 30,
  //
  parallN: 3,
};
