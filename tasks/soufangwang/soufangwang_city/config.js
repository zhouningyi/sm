/**
 * 爬取配置
 */
let Utils = require('./../../../../lib/utils');
let Models = require('./../../../../model');

module.exports = {
  version: 2,
  name: 'soufangwang_city',
  desc: '搜房网 所有城市列表',
  time: {
    type: 'interval',
    value: 1
  },
  urls (cb) {
    let url = 'http://fang.com/SoufunFamily.htm';
    let urls = {
      [1]: { url }
    };
    cb(urls);
  },
  encoding: 'gbk',
  parseType: 'dom',
  processing: require('./processor'),
  //
  parallN: 1,
  queryInterval: 0,
  models: ['soufangwang_city']
};
