/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const dbUtils = require('./../../../lib/dblink/utils');
const redis = require('redis');

const client = redis.createClient(6379, '127.0.0.1');
const _csrf = client.get('_csrf') || 'cHlTHxv7-9j50QOnSH_1YD3_2npvHaJohJcg';


// const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'users',
  desc: '比特币外场交易用户信息',
  time: {
    value: 0.01,
    type: 'interval'
  },
  urls: (cb, db_id) => {
        // const order = dbUtils.findAll().toJSON()
    const url = 'https://www.coincola.com/api/v1/contentslist/search';
    const result = {};
        // result[url] = { url };
        // // result[`${url}_`] = { url };
    const rs = ['BTC', 'ETH', 'USDT', 'BCH', 'LTC'];
        // cb(result);
    const getQuery = (r) => {
      return `country_code=CN&currency=&payment_provider=&limit=200&offset=0&sort_order=GENERAL&type=SELL&crypto_currency=${r}&_csrf=${_csrf}`;
    };
        // result[url] = { url, query };
    _.forEach(rs, (r) => {
      result[`${url}?crypto_currency=${r}`] = { url: `${url}?crypto_currency=${r}`, query: getQuery(r) };
    });
    cb(result);
  },
  queryType: 'post',
  headers: { content_type: 'application/x-www-form-urlencoded',
    cookie: '__cfduid=d90681908a9a73a094e777078932868881518182337; lang=en-US; _ga=GA1.2.1112399451.1518182350; ad_history_country_code=CN; __zlcmid=kth6qOxFDcV2D8; ad_history_payment_provider=; ad_history_currency=; coincola_session=s%3AeBIYu1JffrDWEfHVGm_ZmQGK3mbj-cNd.yQV0DZVKZdx%2B3L59XGo9NPSTXEqGtYMZ6pvaedrC0hQ; _gid=GA1.2.755340795.1522339835'
  },
  parseType: 'json',
  periodInterval: 1,
  models: ['coincola_platform', 'otc_user_order'],
  printInterval: 30,
    // proxy: 'shadow',
    //
  parallN: 10,
};
