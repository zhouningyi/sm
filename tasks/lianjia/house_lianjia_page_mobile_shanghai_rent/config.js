/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');

var maxLen = 100;
const genUrls = (count, urls) => {
  if(!count) return;
  for(var i = 0; i <= count + maxLen; i+= maxLen){
    var url = genURL(i);
    urls[url] = {
      url: url,
      params: {
        type: 'rent'
      }
    };
  }
};

const genURL = (offset) => `http://soa.dooioo.com/api/v4/online/rent/zufang/search?access_token=7poanTTBCymmgE0FOn1oKp&channel=zufang&cityCode=sh&client=wap&limit_count=${maxLen}&limit_offset=${offset}`;

module.exports = {
  version: 2,
  name: 'house_lianjia_page_mobile_shanghai_rent',
  desc: '链家网手机交易列表页, 楼盘出租情况',
  // headers,
  time: {
    type: 'interval',
    value: 1
  },
  urls: cb => {
    const urls = {};
    const onlineN = 80000;//预估线上的房源有8万套
    genUrls(onlineN, urls);
    cb(urls);
  },
  parseType: 'json',
  processing: require('./processer'),
  // proxy: 'abu',
  //
  parallN: 2,
  queryInterval: 300,
  models: ['house_lianjia_details_rent_byplate', 'house_lianjia_community', 'house_lianjia_details_rent_byplate_history'],
  userAgentType: 'mobile',
  printInterval: 30,
};
