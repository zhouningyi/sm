/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');

module.exports = {
  version: 2,
  name: 'soufangwang_city',
  desc: '搜房网 所有城市列表',
  time: {
    type: 'interval',
    value: 1
  },
  urls: function (cb) {
    let url = 'http://fang.com/SoufunFamily.htm';
    let urls = {
      [1]: { url }
    };
    cb(urls);
  },
  encoding: 'gbk',
  parseType: 'dom',
  processing: require('./processer'),
  //
  parallN: 1,
  queryInterval: 0,
  models:['soufangwang_city']
};
