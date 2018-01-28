/**
 * 爬取配置
 */
let Utils = require('./../../../../lib/utils');
let Models = require('./../../../../model');
let gaodefy = require('./../../../../lib/gaodefy');

const list = ['一环', '二环', '三环', '四环', '五环', '内环', '中环', '外环', '绕城'];

module.exports = {
  name: 'amap_loop',
  desc: '中环外环内环搜集',
  // url 所需要的参数排列组合
  time: {
    value: 1,
    type: 'interval'
  },
  urls: (cb) => {
    // var model = Models.house_lianjia_community;
    const sql = `
      SELECT 
        name, 
        adcode
      FROM areas
      WHERE level='city'
      AND adcode LIKE '31%'
    `;
    Models.sequelize.query(sql).then((ds) => {
      let url, 
urls = {};
      ds[0].forEach((d) => {
        const { adcode, name } = d;
        list.forEach((str) => {
          const str1 = str;
          const url1 = gaodefy.getUrlSearch(adcode, str1, 1).substring(0, 255);
          urls[url1] = { url: url1 };
          const str2 = [str, '高速'].join('');
          const url2 = gaodefy.getUrlSearch(adcode, str2, 1).substring(0, 255);
          urls[url2] = { url: url2 };
        });
      });
      cb(urls);
    });
  },
  parallN: 1,
  proxy: 'abu',
  //
  parseType: 'json',
  processing: require('./processor'),
  models: ['amap_loop']
};
