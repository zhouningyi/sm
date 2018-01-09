/**
* @Author: disoul
* @Date:   2017-04-27T22:39:33+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-20T13:38:38+08:00
*/



/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');
var Gaodefy = require('./../../../../lib/gaodefy');


const getQuery = (lat, lng) => {
  return {
    token: 'EC895AB0-17BA-11E7-9EEB-75E9E4A5A59B',
    source:  0,
    lat, lng
  };
};

const getUrl = () => 'https://san.ofo.so/ofo/Api/nearbyofoCar';

const getID = (url, params, query) => [url, query.lat, query.lng].join('_');

module.exports = {
  name: 'ofo_car_month',
  desc: 'ofo单车分布',
  time: {
    value: 10,
    type: 'interval'
  },
  id: getID,
  urls: cb => {
    const urls = {};
    //         WHERE adcode LIKE '4403%'
         // OR adcode LIKE '31%'
         // OR adcode LIKE '11%'
    Models.sequelize.query(`
      WITH tbs AS (
       SELECT * FROM (
         SELECT count(1), st_geohash(center, 7) AS geohash
         FROM  mobike_cars
         WHERE district_adcode LIKE '3101%'
         AND st_contains(st_setsrid(ST_GeomFromGeoJSON ('{ "type": "Polygon", "coordinates": [[[121.6557312012, 31.1123279844],[121.3288879395, 31.1123279844],[121.3288879395, 31.3691746246],[121.6557312012, 31.3691746246],[121.6557312012, 31.1123279844]]]}'), 4326), center)
         GROUP BY st_geohash(center, 7)
         ORDER BY count DESC
       ) AS t
       WHERE count > 3
      )
      SELECT
      (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 0) :: text :: FLOAT AS lng,
      (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 1) :: text :: FLOAT AS lat,
      count
      FROM tbs
      ORDER BY count DESC
      `)
     .then(ds => {
        ds[0].forEach(d => {
          const url = getUrl();
          const query = getQuery(d.lat, d.lng);
          const url_id = getID(url, {}, query);
          urls[url_id] = {url, query};
        });
        cb(urls);
      });
  },
  timeout: 3000,
  interval: 3000,
  parseType: 'json',
  queryType: 'post',
  processing: require('./processer'),
  periodInterval: 1000,
  models: ['ofo_car', 'ofo_user', 'ofo_car_history'],
  printInterval: 10,
  parallN: 5,
  extractN: 200,
};
