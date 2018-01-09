/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');
var gaodefy = require('./../../../../lib/gaodefy');

var LianjiaUtils = require('./../../../utils/lianjia');

var cityname = '上海';
module.exports = {
  name: 'house_lianjia_community_bound_gaodefy',
  desc: '链家网小区边界',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: cb => {
    // var model = Models.house_lianjia_community;
    const sql = `
      SELECT 
        regexp_split_to_table(unnest(address),  ',') as address, 
        community_name,
        community_id,
        community_url, 
        house_lianjia_communities.lat,
        house_lianjia_communities.lng,
        district_adcode, 
        areas.name as city_name
      FROM house_lianjia_communities, areas
      WHERE areas.adcode = SUBSTRING(house_lianjia_communities.adcode, 1, 4) || '00'
      AND house_lianjia_communities.polygon IS NULL
    `;
    Models.sequelize.query(sql).then(ds =>  {
      let url, urls = {};
      let ii = 0;
      ds[0].forEach(d => {
        let {community_id, address, lat, lng, community_name, city_name, district_adcode, community_url} = d;
        city_name = city_name.split('市')[0] + '市';
        const str1 = [city_name, address].join(' ');
        const str2 = [city_name, community_name].join(' ');
        const params = {community_id, address, lat, lng};
        const url1 = gaodefy.getUrlSearch(district_adcode, str1, 1).substring(0, 255);
        const url2 = gaodefy.getUrlSearch(district_adcode, str2, 1).substring(0, 255);
        urls[url1] = {
          url: url1,
          params
        };
        urls[url2] = {
          url: url2,
          params
        };
      });
      cb(urls);
    });
  },
  parallN: 1,
  // proxy: 'abu',
  interval: 500,
  printInterval: 1,
  //
  parseType: 'json',
  processing: require('./processer'),
  models: ['house_lianjia_community', 'region']
};
