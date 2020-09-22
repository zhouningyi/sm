/**
 * 爬取配置
 */
// const Models = require('./../../../../model');
const gaodefy = require('./../../../lib/gaodefy');
const dblink = require('./../../../lib/dblink');

const _ = require('lodash');

module.exports = {
  version: 2,
  name: 'amap_address_washes',
  desc: '清洗地址数据',
  parallN: 2,
  queryInterval: 10,
  time: {
    type: 'interval',
    value: 1
  },
  headers: {
    // Host: 'amap.com',
    // Referer: 'https://amap.com',
    // Cookie: 'cna=VRroFtcBamoCAWVTpAXeYQbO; UM_distinctid=1729eb97546377-0c291f9b415571-143e6257-1fa400-1729eb97547d0e; _uab_collina=159180085536091193360616; passport_login=MzYzMzMyNTc4LGFtYXBfMTg0MzcxNTE2NTNBcFdTQUpRTXYscHl0emNmZzNseXlyd3Bhb3VnczdzaG51d2hsY3Qyem8sMTU5MTgwMDg5MixZekptWVRVek5HWTNabU00T0dJM05HWTVabVZtWVRjeE5EYzFaVEl6WkdZPQ%3D%3D; oauth_state=e0a92c690791503798976218b2ee2b0e; dev_help=3HAO%2BKYZD%2BC8uGKZFY%2BaVmFlYTZhNDVmN2Y1NjIwMGRiZTJhYTJjNjQ4ZmRiMjJhNzczMDc3ZGE4NmRkYTFkNGRjN2I4MzQyZWRiMzQ3ZTjnU6CUBskXu77wZqHJkNdSzyaJJpx27O97XqeTFOn15PbL%2B929f8yCqOFZ%2Fpfu1gVSQRO9252Q8lf9f%2B7hXxAL7RntaFmHmetOtYImZpGp8QQNezOVIFy14weaKsyzAJc%3D; gray_auth=2; x-csrf-token=ccc7f8a30a48f7895ca80cfc458a1a90; CNZZDATA1255626299=691997463-1591797317-%7C1592828714; l=eBxuNtHeQ9P89TlNBO5Zlurza77TmIOf1sPzaNbMiInca6NRGFNteNQDkSXkPdtjgtfbKe-ybehqARE68Aa3WxNrWaUpn99P3Ov6-; isg=BGpqzXg_wNWj1Uwp0IVn41AOu9YM2-41d0mT0_QiHb1IJwnh32qoRM8Rt1M712bN',
  },
  urls: async (cb, db_id) => {
    // 选取上海范围内的点
    const sql = `
    with tbs as (
      SELECT 
        poi_id, unique_id, raw_type_id, name, real_address, "updatedAt",
       (((st_asgeojson(center)::json) -> 'coordinates') -> 0)::text::FLOAT as lng,
       (((st_asgeojson(center)::json) -> 'coordinates') -> 1)::text::FLOAT as lat  
      FROM amap_tile_poi
      WHERE center is not null
      --AND now () - "updatedAt" > interval '15 DAY'
     )
     SELECT * FROM tbs
     WHERE lng > 120.86 AND lng< 122.2
     AND lat > 30.6 AND lat < 31.86
     --AND raw_type_id = '10002:15'
     AND real_address IS NULL 
     AND now() - "updatedAt" > interval '1 day'
     limit 500
    `;
    const { data: ds } = await dblink.queryRaw(db_id, sql);
    const urls = {};
    _.forEach(ds, (d) => {
      const { unique_id, poi_id, name, lat, lng } = d;
      const url = gaodefy.getUrlRGeoCoder(lat, lng, 1000);
      urls[url] = { url, params: { unique_id, name } };
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
  parseType: 'json',
  end: {
    type: 'restart',
    isUpdate: true,
  },
  printInterval: 30,
  //
  models: ['amap_tile_poi']
};
