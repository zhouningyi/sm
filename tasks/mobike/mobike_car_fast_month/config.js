/**
* @Author: disoul
* @Date:   2017-05-05T20:31:52+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-19T10:28:30+08:00
*/



/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');
var Gaodefy = require('./../../../../lib/gaodefy');


const getQuery = (lat, lng) => {
  return {
    errMsg: 'getMapCenterLocation',
    longitude: lng,
    latitude: lat,
  };
};
const getUrl = () => 'https://mwx.mobike.com/mobike-api/rent/nearbyBikesInfo.do';

const getID = (url, params, query) => [url, query.longitude, query.latitude].join('_');

module.exports = {
  name: 'mobike_car_fast_month',
  desc: 'mobike单车快速爬虫',
  time: {
    value: 1,
    type: 'interval'
  },
  headers: {
    charset: "utf-8",
    platform: "3",
    //mobileNo: '15061884031',
    mobileNo: '',
    referer:"https://servicewechat.com/wx80f809371ae33eda/15/page-frame.html",
    'content-type': "application/x-www-form-urlencoded",
    'user-agent': "MicroMessenger/6.5.4.1000 NetType/WIFI Language/zh_CN",
    host: "mwx.mobike.com",
    connection: "Keep-Alive",
    'accept-encoding': "gzip",
    'cache-control': "no-cache",
     //accesstoken: '8017d2105328d35dc4a5ceb7c2e9810c',
     wxcode: "04151eAJ18S0W80TCqCJ1cjsAJ151eA6",
  },
  id: getID,
  urls: cb => {
         // SELECT count(1), st_geohash(center, 7) AS geohash
         // FROM regions --buildings
         // WHERE adcode LIKE '4403%'
         // OR    adcode LIKE '310%'
         // OR    adcode LIKE '110%'
         // OR    adcode LIKE '4401%'
         // OR    adcode LIKE '5101%'
         // OR    adcode LIKE '3201%'
         // OR    adcode LIKE '120%'
         // GROUP BY st_geohash(center, 7)
         // ORDER BY count DESC

         // SELECT count(1), st_geohash(center, 7) AS geohash
         // FROM  mobike_cars
         // WHERE district_adcode LIKE '10%' OR district_adcode LIKE '31%' OR district_adcode LIKE '44%'
         // GROUP BY st_geohash(center, 7)
         // ORDER BY count DESC
    Models.sequelize.query(`
       SELECT
       (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 0) :: text :: FLOAT AS lng,
       (st_asgeojson(ST_PointFromGeoHash(geohash))::json -> 'coordinates' -> 1) :: text :: FLOAT AS lat,
       t.count
       FROM (
         SELECT count(1), st_geohash(center, 7) AS geohash
         FROM  mobike_cars
         WHERE district_adcode LIKE '3101%'
         AND st_contains(st_setsrid(ST_GeomFromGeoJSON ('{ "type": "Polygon", "coordinates": [[[121.6557312012, 31.1123279844],[121.3288879395, 31.1123279844],[121.3288879395, 31.3691746246],[121.6557312012, 31.3691746246],[121.6557312012, 31.1123279844]]]}'), 4326), center)
         GROUP BY st_geohash(center, 7)
         ORDER BY count DESC
       ) AS t
       WHERE t.count > 3
       ORDER BY count
      `)
     .then(ds => {
        const urls = [];
        let index = 0;
        ds[0].forEach(d => {
          index++;
          const url = getUrl();
          const query  = getQuery(d.lat, d.lng);
          const url_id = getID(url, {}, query);
          urls.push({url, query, index});
        });
        cb(urls);
      });
  },
  parseType: 'json',
  queryType: 'post',
  timeout: 3000,
  processing: require('./processer'),
  periodInterval: 1000,
  // proxy:'abu',
  models: ['mobike_car_fast', 'mobike_car_fast_history'],
  printInterval: 10,
  parallN: 5,
};
