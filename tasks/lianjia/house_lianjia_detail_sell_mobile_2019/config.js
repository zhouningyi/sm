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
  name: 'house_lianjia_app_detail',
  desc: '链家App详细信息',
  // headers: headers,
  time: {
    type: 'interval',
    value: 2,
  },
  // interval: 1000,
  urls(cb) {
    const urls = [];

    const model = Models.house_lianjia_details_byapp;
    const index = 0;
    const now = Date.now();
    const now_last = now - (1000 * 60 * 60 * 24 * 30 * 3);

    Models.house_lianjia_details_byapp.findAll({
      where: {
        price_chengjiao: {
          $eq: null,
        },
        updatedAt: {
          gte: new Date(now_last),
        },
        adcode: '310000',
      }
    }).then((ds) => {
      let url,
        d,
        dclone;
      for (const i in ds) {
        d = ds[i].dataValues;
        url = genURL(d.house_id);
        urls.push({
          url,
          params: {
            data: d,
          }
        });
      }
      cb(urls);
    });
  },
  parseType: 'json',
  processing: require('./processer'),
  poolSize: 6,
  queryInterval: 300,
  models: ['house_lianjia_details_byapp', 'house_lianjia_details_byapp_history']
};


// module.exports = {
//   version: 2,
//   name: 'house_lianjia_detail_sell_mobile_2019',
//   desc: '链家手机交易详情',
//   time: {
//     type: 'interval',
//     value: 2
//   },
//   // headers,
//   urls(cb) {
//     Models.sequelize.query(`
//       SELECT trade_id
//       FROM house_lianjia_details
//       WHERE adcode LIKE '31%'
//       AND now() - "online_date_last" < INTERVAL '2 DAY'
//     `)
//     .then((ds) => {
//       ds = ds[0];
//       const urls = {};
//       let url,
//         d,
//         dclone;
//       for (const i in ds) {
//         d = ds[i];
//         url = genURL(d.trade_id);
//         urls[url] = { url };
//       }
//       cb(urls);
//     });
//   },
//   parseType: 'json',
//   processing: require('./processor'),
//   parallN: 3,
//   printInterval: 5,
//   queryInterval: 100,
//   queryTimeout: 10 * 1000,
//   models: ['house_lianjia_detail']
// };
