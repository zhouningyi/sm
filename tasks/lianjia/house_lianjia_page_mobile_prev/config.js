/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');
const headers = require('./headers');
module.exports = {
  name: 'house_lianjia_page_mobile_prev',
  desc: '链家网手机交易列表页, 显示每个城市的售卖量',
  // headers: headers,
  time: {
    type: 'interval',
    value: 0.05
  },
  urls: function (cb) {
    Models.sequelize.query(`
      SELECT id, city_name, adcode
      FROM seed_lianjia_mobiles
    `)
    .then(function(ds){
       var urls = {};
       var url, d, dclone, params;
       ds[0].forEach(function(params){
         url = 'http://m.api.lianjia.com/house/ershoufang/search?city_id=' + params.adcode + '&limit_count=100&limit_offset=0';
         urls[url] = {
          url: url,
          params: params
         };
         pclone = JSON.parse(JSON.stringify(params));
         url = 'http://m.api.lianjia.com/house/zufang/search?city_id=' + params.adcode + '&limit_count=100&limit_offset=0';
         urls[url] = {
          url: url,
          params: params
         };
       })
       cb(urls);
    });
  },
  parseType: 'json',
  processing: require('./processer'),
  // proxy: 'abu',
  //
  models: ['seed_lianjia_mobile'],
  parallN: 5,
  queryInterval: 10,
};
