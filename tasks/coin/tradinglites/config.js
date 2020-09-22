/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Utils = require('./../../../lib/utils');

const { cookie, timeConfig, getAssets, getIntervals } = require('./utils');

module.exports = {
  name: 'tradinglites',
  desc: 'tradinglites',
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
  encoding: null, // 'binary',
  urls: (cb) => {
    const urls = {};
    const assets = getAssets();
    const hour = 3600;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 31;
    const year = day * 365;
    const mainInterval = week;
    const now = new Date().getTime() / 1000;
    for (const i in assets) {
      const asset = assets[i];
      const { interval, timeend } = timeConfig;
      const intervalN = Math.floor(mainInterval / interval);
      const time_start = timeend - intervalN * interval;
      const intervals = getIntervals(now - week, now);
      for (const tend of intervals) {
        const tstart = tend - interval;
        const url = `https://tradinglite.com/api/heatmap?exchange=${asset.exchange.toLowerCase()}&symbol=${asset.tradinglite_id}&timeframe=1&mode=1&start=${tstart}&end=${tend}`;
        urls[url] = { url, params: { symbol_id: asset.symbol_id, interval: '1m' } };
      }
      // for (let t = time_start; t < now; t += interval) {
      //   if (t < now - mainInterval) continue;
      //   const _tend = t;
      //   const _tstart = _tend - interval;
      //   const url = `https://tradinglite.com/api/heatmap?exchange=${asset.exchange.toLowerCase()}&symbol=${asset.tradinglite_id}&timeframe=1&mode=1&start=${_tstart}&end=${_tend}`;
      //   urls[url] = { url, params: { symbol_id: asset.symbol_id, interval: '1m' } };
      // }
    }
    cb(urls);
  },
  parseType: 'raw',
  periodInterval: 1000,
  models: [],
  printInterval: 30,
  parallN: 1,
};
