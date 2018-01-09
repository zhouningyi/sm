const Utils = require('./../utils');
const rUA = require('random-useragent');

// /////////////////////////////user-agent相关///////////////////////////////

const filters = {
  // 获取随机手机的ua
  mobile: (d) => {
    return d.deviceType === 'mobile' || d.deviceModel in ['iPhone', 'ipad'];
  },
  // 获取随机pc的ua
  pc: (d) => {
    const ua = (d.userAgent || '').toLowerCase();
    return ua.deviceType !== 'mobile' && (ua.indexOf('windows nt') !== -1 || ua.indexOf('macintosh') !== -1);
  },
  // 获取百度ua
  baidu: (d) => {
    return d.browserName === 'Baidu';
  }
};

const getRandomUA = (deviceType, numType) => {
  let filter = (typeof (deviceType) === 'function') ? deviceType : filters[deviceType];
  filter = filter || function () { return true; };
  if (numType === 'all') return rUA.getAll(filter);
  return rUA.getRandom(filter);
};

// /////////////////////////////ip相关///////////////////////////////

// 0-255的随机数
const _rand255 = () => Math.floor(255 * Math.random());
const getRandomIP = () => {
  return [1, 2, 3, 4].map(_rand255).join('.');
};

module.exports = Object.assign(Utils, {
  // user agent相关
  getRandomUA,
  // ip相关
  getRandomIP
});
