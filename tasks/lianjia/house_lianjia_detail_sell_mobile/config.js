/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const Models = require('./../../../../model');
// const headers = require('./headers');

const maxLen = 100;
function genURL(trade_id) {
  return `http://m.api.lianjia.com/house/ershoufang/detail?house_code=${trade_id}`;
}

module.exports = {
  name: 'house_lianjia_detail_sell_mobile',
  desc: '链家手机交易详情',
  // headers,
  timestamp: Utils.timeStampByDate(0.5),
  urls(cb) {
    Models.house_lianjia_detail.findAll({
      where: {
        trade_type: {// 排除租房数据
          $not: 'rent'
        },
        trade_id: {
          $like: '31%'
        }
      },
      attributes: ['trade_id']
    }).then((ds) => {
      const urls = {};
      let url;
      let d;
      let dclone;
      for (const i in ds) {
        d = ds[i].dataValues;
        url = genURL(d.trade_id);
        urls[url] = {
          url
        };
      }
      cb(urls);
    });
  },
  parseType: 'json',
  processing: require('./processor'),
  poolSize: 10,
  queryInterval: 0,
  periodInterval: 2000,
  models: ['house_lianjia_detail']
};
