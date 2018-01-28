/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const Models = require('./../../../../model');
const fetch = require('../../../utils/fetch');
const fs = require('fs');
const path = require('path');
const d3 = require('d3');

// 把基础的url丢到里面去
module.exports = {
  version: 2,
  name: 'pinglun_xiaochu',
  desc: '搜房评论2',
  time: {
    type: 'interval',
    value: 1
  },
  urls(cb) {
    Models.soufang_community.findAll().then((ds) => {
      const urls = [];
      ds.forEach((d) => {
        d = d.dataValues;
        const { community_id } = d;
        const url = `http://xijiaohuayuanrh.fang.com/house/ajaxrequest/dianpingList_201501.php?city=%E4%B8%8A%E6%B5%B7&newcode=${community_id}&jiajing=0&page=1&tid=&pagesize=2000&starnum=6&shtag=-1`;
        urls.push({ url,
params: {
          community_id
        } });
      });
      cb(urls);
    });
  },
  encoding: 'gb2312',
  parseType: 'json',
  processing: require('./processor'),
  //
  parallN: 10,
  queryInterval: 0,
  models: ['soufang_pinglun']
};
