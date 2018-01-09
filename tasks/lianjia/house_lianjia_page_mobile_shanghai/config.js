/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');
var headers = require('./headers');

var maxLen = 100;
const genUrls = (adcode, count, urls, type) => {
  if(!count) return;
  for(var i = 0; i <= count + maxLen; i+= maxLen){
    var url = genURL(i, type);
    urls[url] = {
      url: url,
      params: { adcode, type }
    };
  }
};

const genURL = (offset, type) => `http://soa.dooioo.com/api/v4/online/house/ershoufang/search?access_token=7poanTTBCymmgE0FOn1oKp&channel=ershoufang&cityCode=sh&client=wap&limit_count=${maxLen}&limit_offset=${offset}`;

module.exports = {
  version: 2,
  name: 'house_lianjia_page_mobile_shanghai',
  desc: '链家网手机交易列表页, 楼盘销售 / 出租情况',
  // headers: headers,
  time: {
    type: 'interval',
    value: 1
  },
  urls: function (cb) {
    const urls = {};
    const onlineN = 10 * 10000;//预估线上的房源有10万套
    genUrls(310000, onlineN, urls, 'sell');
    cb(urls);
  },
  parseType: 'json',
  processing: require('./processer'),
  // proxy: 'abu',
  //
  parallN: 2,
  queryInterval: 300,
  models: [
    'house_lianjia_detail', 
    'house_lianjia_details_byplate', 
    'house_lianjia_details_byplate_history', 
    'house_lianjia_community'
  ],
  userAgentType: 'mobile',
  printInterval: 5,
};
