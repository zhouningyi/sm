/**
 * 爬取配置
*/

const Models = require('./../../../../model');
// var gaodefy = require('./../../../../lib/gaodefy');

const _ = require('lodash');

const getUrl = (d, i) => {
  return `https://www.ele.me/restapi/shopping/v2/menu?restaurant_id=${d.shop_id}`;
};

const sql = `
  SELECT shop_id
  FROM eleme_shops
  WHERE district_adcode LIKE '31%'
  ORDER BY recent_order_num DESC;
`;

const cookie = 'ubt_ssid=856bkwk7fdxrofef60oaihv2rctvjrmt_2017-10-03; _utrace=ef6da247f61b889fa94bae800a1ac08a_2017-10-03; firstEnterUrlInSession=https%3A//www.ele.me/shop/2358234; perf_ssid=vyjg4c38tosfveotf286o0cwzq8kswvv_2017-10-03; pageReferrInSession=https%3A//www.ele.me/place/wt02d5jbdk6%3Flatitude%3D28.22948%26longitude%3D112.94745';
const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';
module.exports = {
  name: 'eleme_food',
  desc: '饿了么食品',
  parallN: 2,
  extractN: 5000,
  headers: {
    cookie,
    Cookie: cookie,
    // // ':scheme:':'https',
    // // ':authority:': 'www.ele.me',
    // // ':path:': '/restapi/shopping/v2/menu?restaurant_id=856712',
    // referer: 'https://www.ele.me/shop/856712',
    // 'User-Agent': ua,
    // 'user-agent': ua,
    'x-shard': () => {
      return `shopid=${856712 + Math.floor(Math.random() * 1000)};loc=1${Math.floor(Math.random() * 10 + 10)}.94745,28.22948`;
    }
  },
  time: {
    type: 'interval',
    value: 7
  },
  urls(cb) {
    // const urls = {};
    // const url = 'https://www.ele.me/restapi/shopping/v2/menu?restaurant_id=157477135';
    // urls[url] = { url };
    // cb(urls);

    Models.sequelize
    .query(sql)
    .then((ds) => {
      var name,
        url,
        ds = ds[0],
        urls = {};
      ds.forEach((d) => {
        for (let i = 0; i < 1; i++) {
          const url = getUrl(d, i);
          urls[url] = { url };
        }
      });
      cb(urls);
    });
  },
  //
  parseType: 'json',
  printInterval: 10,
  processing: require('./processor'),
  //
  // proxy: 'abu',
  models: ['eleme_shop', 'eleme_food_sku', 'eleme_food_item', 'eleme_category', 'eleme_title_tag', 'eleme_food_sku_history', 'eleme_map_food_item__tag']
};
