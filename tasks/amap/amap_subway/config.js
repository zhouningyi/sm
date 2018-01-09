/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');
var gaodefy = require('./../../../../lib/gaodefy');

var _ = require('lodash');

const urllist = [
  'http://map.amap.com/service/subway?srhdata=4201_drw_wuhan.json',
  'http://map.amap.com/service/subway?srhdata=1100_drw_beijing.json',
  'http://map.amap.com/service/subway?srhdata=3100_drw_shanghai.json',
  'http://map.amap.com/service/subway?srhdata=4401_drw_guangzhou.json',
  'http://map.amap.com/service/subway?srhdata=4403_drw_shenzhen.json',
  'http://map.amap.com/service/subway?srhdata=1200_drw_tianjin.json',
  'http://map.amap.com/service/subway?srhdata=3201_drw_nanjing.json',
  'http://map.amap.com/service/subway?srhdata=8100_drw_xianggang.json',
  'http://map.amap.com/service/subway?srhdata=3301_drw_hangzhou.json',
  'http://map.amap.com/service/subway?srhdata=5000_drw_chongqing.json',
  'http://map.amap.com/service/subway?srhdata=2101_drw_shenyang.json',
  'http://map.amap.com/service/subway?srhdata=2102_drw_dalian.json',
  'http://map.amap.com/service/subway?srhdata=5101_drw_chengdu.json',
  'http://map.amap.com/service/subway?srhdata=2201_drw_changchun.json',
  'http://map.amap.com/service/subway?srhdata=3205_drw_suzhou.json',
  'http://map.amap.com/service/subway?srhdata=4406_drw_foshan.json',
  'http://map.amap.com/service/subway?srhdata=5301_drw_kunming.json',
  'http://map.amap.com/service/subway?srhdata=6101_drw_xian.json',
  'http://map.amap.com/service/subway?srhdata=4101_drw_zhengzhou.json',
  'http://map.amap.com/service/subway?srhdata=4301_drw_changsha.json',
  'http://map.amap.com/service/subway?srhdata=3302_drw_ningbo.json',
  'http://map.amap.com/service/subway?srhdata=3202_drw_wuxi.json',
  'http://map.amap.com/service/subway?srhdata=3702_drw_qingdao.json',
  'http://map.amap.com/service/subway?srhdata=3601_drw_nanchang.json',
  'http://map.amap.com/service/subway?srhdata=3501_drw_fuzhou.json',
  'http://map.amap.com/service/subway?srhdata=4419_drw_dongguan.json',
  'http://map.amap.com/service/subway?srhdata=2301_drw_haerbin.json',
  'http://map.amap.com/service/subway?srhdata=3401_drw_hefei.json',
  'http://map.amap.com/service/subway?srhdata=4501_drw_nanning.json',
];

module.exports = {
  version: 2,
  name: 'amap_subway',
  desc: '爬所有的地铁线',
  parallN: 2,
  queryInterval: 10,
  time: {
    type: 'interval',
    value: 1
  },
  urls: function(cb){
    const urls = {};
    urllist.forEach(url => {
      urls[url] = {url};
    });
    cb(urls);
  },
  parseType: 'json',
  timeout: 5000,
  processing: require('./processer'),
  //
  models: ['amap_subway_site', 'amap_subway']
};
