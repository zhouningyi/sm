/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const Models = require('./../../../../model');
const headers = require('./headers');

const maxLen = 100;
function genURL(trade_id) {
  trade_id = trade_id.replace('sh', '');
  return `http://soa.dooioo.com/api/v4/online/house/ershoufang/detail?access_token=7poanTTBCymmgE0FOn1oKp&cityCode=sh&client=ios&houseSellId=${trade_id}`;
}

module.exports = {
  version: 2,
  name: 'house_lianjia_detail_sell_mobile_shanghai',
  desc: '链家手机交易详情_上海',
  time: {
    type: 'interval',
    value: 2
  },
  // headers,
  urls(cb) {
    Models.sequelize.query(`
      SELECT trade_id
      FROM house_lianjia_details 
      WHERE adcode LIKE '31%'
      AND now() - "online_date_last" < INTERVAL '2 DAY'
    `)
    .then((ds) => {
      ds = ds[0];
      const urls = {};
      let url,
        d,
        dclone;
      for (const i in ds) {
        d = ds[i];
        url = genURL(d.trade_id);
        urls[url] = { url };
      }
      cb(urls);
    });
  },
  parseType: 'json',
  processing: require('./processor'),
  parallN: 3,
  printInterval: 5,
  queryInterval: 100,
  queryTimeout: 10 * 1000,
  models: ['house_lianjia_detail']
};
