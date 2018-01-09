/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');
var gaodefy = require('./../../../../lib/gaodefy');

var _ = require('lodash');


const createUrl = (d, urls) => {
  if(d.text && d.text.length > 10) d.text = d.text.substring(0, 4);
  url = gaodefy.getUrlSearchQuilk(d.text, d.adcode);
  url = url.replace(/"/g, '');
  url = url.replace(/'/g, '');
  if(Math.random() < 0.00001) console.log(url)
  urls[url] = {
    url: url
  };
}

module.exports = {
  name: 'amap_search_quilk_liansuo',
  desc: '通过高德搜索补全接口 定制化获取大量poi点',
  parallN: 50,
  queryInterval: 50,
  extractN: 5000,
  time: {
    type: 'interval',
    value: 7
  },
  urls: function(cb){

    const addons = '';// "AND adcode LIKE '50%'"
    Models.sequelize
    .query(`
        WITH tbs AS (
          SELECT count(1), (string_to_array(full_name, '('))[1] as "name", substring(adcode, 1, 4) as adcode  
          FROM regions
          WHERE full_name is not null
          ${addons}
          AND full_name LIKE '%(%'
          group by  substring(adcode, 1, 4), (string_to_array(full_name, '('))[1]
        )
        
        select  areas."name" || ' ' || tbs."name" as "text", tbs.adcode || '00' as "adcode"
        from tbs, areas
        where areas.level = 'district'
        and tbs.count > 3 
        and areas.adcode like tbs.adcode || '%'
      `)
    .then(function(ds){
      var name, url, ds = ds[0];
      var urls = {};
      ds.forEach(function(d){
        createUrl(d, urls);
      });
      cb(urls);
    });
  },
  //
  'parseType': 'json',
  'processing': require('./processer'),
  //
  'save': 'postgres',
  'models': ['region']
};
