/**
 * 爬取配置
 */
let Utils = require('./../../../../lib/utils');
let Models = require('./../../../../model');
let Gaodefy = require('./../../../../lib/gaodefy');

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
  name: 'mobike_car',
  desc: 'mobike单车分布',
  time: {
    value: 1,
    type: 'interval'
  },
  headers: {
    charset: 'utf-8',
    platform: '3',
    mobileNo: '18357138841',
    referer: 'https://servicewechat.com/wx80f809371ae33eda/15/page-frame.html',
    'content-type': 'application/x-www-form-urlencoded',
    'user-agent': 'MicroMessenger/6.5.4.1000 NetType/WIFI Language/zh_CN',
    host: 'mwx.mobike.com',
    connection: 'Keep-Alive',
    'accept-encoding': 'gzip',
    'cache-control': 'no-cache',
    accesstoken: 'b5dc619298f55ed519be42c542452a9a',
     // wxcode: '021izFnS1CUPCa1EmfpS1mtBnS1izFnY'
  },
  id: getID,
  urls: (cb) => {
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
        --WHERE district_adcode LIKE '310104%'
        -- WHERE district_adcode LIKE '110%'
        -- WHERE district_adcode LIKE '10%' OR district_adcode LIKE '31%' OR district_adcode LIKE '44%'
         GROUP BY st_geohash(center, 7)
         ORDER BY count DESC
       ) AS t
       WHERE t.count > 3
       ORDER BY count
      `)
     .then((ds) => {
       const urls = [];
       let index = 0;
       ds[0].forEach((d) => {
          index++;
          const url = getUrl();
          const query = getQuery(d.lat, d.lng);
          const url_id = getID(url, {}, query);
          urls.push({ url, query, index });
        });
       cb(urls);
     });
  },
  parseType: 'json',
  queryType: 'post',
  timeout: 3000,
  processing: require('./processor'),
  periodInterval: 1000,
  // proxy:'abu',
  models: ['mobike_car', 'mobike_car_history'],
  printInterval: 10,
  parallN: 5,
};
