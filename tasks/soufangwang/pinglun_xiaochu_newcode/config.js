/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');
const fetch = require('../../../utils/fetch');
const fs = require('fs');
const path = require('path');
const d3 = require('d3');

//把基础的url丢到里面去
module.exports = {
  version: 2,
  name: 'pinglun_xiaochu_newcode',
  desc: '搜房评论1',
  time: {
    type: 'interval',
    value: 1
  },
  urls: function (cb) {
    const pth = path.join(__dirname, 'list.csv');
    const text = fs.readFileSync(pth, 'utf8');
    const urls = text.replace(/\n/g, '').split('\r').map(url => ({url}));
    cb(urls);
  },
  encoding: 'gb2312',
  parseType: 'dom',
  processing: require('./processer'),
  //
  parallN: 1,
  queryInterval: 0,
  models:['soufang_community']
};
