/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const Models = require('./../../../../model');

const url = 'http://m.lianjia.com/city/';

module.exports = {
  version: 2,
  name: 'house_lianjia_city',
  desc: '链家网 所有城市列表',
  time: {
    type: 'interval',
    value: 0.00001
  },
  urls(cb) {
    Models.house_lianjia_city.findAll({}).then((ds) => {
      const urls = {};
      urls[url] = { url };
      cb(urls);
    });
  },
  parseType: 'dom',
  processing: require('./processor'),
  //
  poolSize: 1,
  queryInterval: 0,
  models: ['house_lianjia_city']
};
