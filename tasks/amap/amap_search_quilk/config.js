/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const Models = require('./../../../../model');
const gaodefy = require('./../../../../lib/gaodefy');

const _ = require('lodash');

const createUrl = (d, urls) => {
  url = gaodefy.getUrlSearchQuilk(d.text, d.adcode);
  url = url.replace(/"/g, '');
  url = url.replace(/'/g, '');
  if (Math.random() < 0.00001) console.log(url);
  urls[url] = {
    url
  };
};

const fenci = `
    WITH tbs AS (
      SELECT DISTINCT(substring(poi_word_count.name, 1, 4)) AS "name"
      FROM poi_word_count
      WHERE cnt > 50 
      AND length(poi_word_count.name) > 1
      AND length(poi_word_count.name) < 5
    )
    SELECT areas.name || ' ' || tbs."name" as "text", areas.name AS name, adcode
    FROM  tbs, areas
    WHERE areas.level = 'city'
`;

const frequecy = `
   WITH tbs as (
     SELECT str AS name
     FROM analysis.poi_first2_str_count 
     WHERE str not in (select substring(name, 1, 2) from areas) 
     LIMIT 1000
   )

    SELECT areas.name || ' ' || tbs."name" as "text", areas.name AS name, adcode
    FROM  tbs, areas
    WHERE areas.level = 'district'
`;

const frequecyShanghai = `
    WITH tbs as (
     SELECT str AS name
     FROM analysis.poi_first2_str_count 
     WHERE str not in (select substring(name, 1, 2) from areas) 
     LIMIT 1000
   )

    SELECT tbs."name" as "text", house_lianjia_plates.name AS name, adcode
    FROM  tbs, house_lianjia_plates
    WHERE house_lianjia_plates.adcode LIKE '31%'
`;

const houseShanghai = `
     SELECT 
       substring(community_name, 1, 4) as "text",
       adcode
     FROM public.house_lianjia_communities 
`;

module.exports = {
  name: 'amap_search_quilk',
  desc: '通过高德搜索补全接口获取大量poi点',
  parallN: 50,
  queryInterval: 50,
  extractN: 5000,
  time: {
    type: 'interval',
    value: 7
  },
  urls(cb) {
    // const addons = '' //"AND adcode LIKE '50%'";
    Models.sequelize
    .query(houseShanghai)
    .then((ds) => {
      var name,
        url,
        ds = ds[0];
      const urls = {};
      ds.forEach((d) => {
        createUrl(d, urls);
      });
      cb(urls);
    });
  },
  //
  parseType: 'json',
  processing: require('./processor'),
  //
  save: 'postgres',
  models: ['region']
};
