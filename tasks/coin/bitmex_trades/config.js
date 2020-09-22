/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Utils = require('./../../../lib/utils');

const { cookie, timeConfig, getAssets } = require('./utils');


function fix(d) {
  return (d < 10) ? `0${d}` : d;
}

function timeFormater(t, full = true) {
  if (!t || typeof t !== 'object') return ' null ';
  const year = t.getFullYear();
  const month = fix(t.getMonth() + 1);
  const day = fix(t.getDate());

  const hour = fix(t.getHours());
  const minite = fix(t.getMinutes());
  const second = fix(t.getSeconds());
  // const miliDigit = Math.pow(10, digit);
  // const milisec = Math.floor(((t.getMilliseconds() / 60) % 1) * miliDigit);
  const dayStr = `${year}-${month}-${day}`;
  return full ? `${dayStr} ${hour}:${minite}:${second}` : dayStr;
}


module.exports = {
  name: 'bitmex_trades',
  desc: 'bitmex_trades',
  time: { value: 10, type: 'interval' },
  headers: {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-US;q=0.6,en;q=0.5,zh-TW;q=0.4',
    accountid: '5ee62f6f4b88746d7c2dee5f',
    layoutid: 'RZlLNgqF',
    'content-type': 'application/json',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    cookie, // '_ga=GA1.2.1412857756.1597639123; _gid=GA1.2.1556891245.1597639123; access-token=ProsoZ7EAYLL2b6c; accountId=5ee62f6f4b88746d7c2dee5f; _gat_gtag_UA_17889318_9=1'
  },
  // encoding: null, // 'binary',
  urls: (cb) => {
    const urls = {};
    const hour = 3600 * 1000;
    const day = hour * 24;
    const month = day * 31;
    const year = day * 365;
    const mainInterval = year;
    const now = new Date().getTime();
    const interval = 30 * 1000;
    // / 1000;
    const symbol = 'XBT:perpetual';
    const symbol_id = 'BITMEX_PERP_BTC_USD';
    for (let tend = now - 8 * hour; tend > now - mainInterval; tend -= interval) {
      const tstart = tend - interval;
      const tstartString = timeFormater(new Date(tstart));
      const tendString = timeFormater(new Date(tend));
      let url = `https://www.bitmex.com/api/v1/trade?symbol=${symbol}&count=1000&reverse=false&startTime=${tstartString}&endTime=${tendString}`;
      url = encodeURI(url);
      const params = { symbol_id };
      urls[url] = { url, params };
    }
    cb(urls);
  },
  parseType: 'json',
  periodInterval: 1000,
  models: [],
  printInterval: 30,
  parallN: 1,
};
