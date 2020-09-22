/**
 * 爬取配置
 */
const _ = require('lodash');
const Utils = require('./../../../lib/utils');
const argv = require('optimist').argv;

const {
  // cookie,
  getIntervals,
  timeConfig,
  getAssets } = require('./../tradinglites/utils');

const cookie = '_ga=GA1.2.1501744131.1592143406; __stripe_mid=b6995969-6288-456f-a817-98f7b6b859bf; apiKey=fca67203-d339-5fab-bfe6-c85d74cf666f; access-token=rYW3rsb76OLEN6N2; accountId=5ee62f6f4b88746d7c2dee5f';

const MODE = argv.MODE || 'kline';

function getUrl(asset, tstart, tend) {
  if (MODE === 'trade') return `https://tradinglite.com/api/volume?exchange=${asset.exchange.toLowerCase()}&symbol=${asset.tradinglite_id}&timeframe=1&start=${tstart}&end=${tend}`;
  if (MODE === 'kline') return `https://tradinglite.com/api/candles?exchange=${asset.exchange.toLowerCase()}&symbol=${asset.tradinglite_id}&timeframe=1&start=${tstart}&end=${tend}`;
}

module.exports = {
  name: 'tradinglite_klines',
  desc: 'tradinglite_klines',
  time: {
    value: 10,
    type: 'interval'
  },
  headers: {
    accept: '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-US;q=0.6,en;q=0.5,zh-TW;q=0.4',
    accountid: '5ee62f6f4b88746d7c2dee5f',
    layoutid: 'RZlLNgqF',
    'content-type': 'application/json',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    cookie,
  },
  encoding: null, // 'binary',
  urls: (cb) => {
    const urls = {};
    const assets = getAssets();
    const hour = 3060;
    const day = hour * 24;
    const week = day * 7;
    const year = day * 365;
    const now = new Date().getTime() / 1000;
    for (const i in assets) {
      const asset = assets[i];
      const { interval } = timeConfig;
      const intervals = getIntervals(now - 4 * week, now - week);
      for (const t of intervals) {
        const url = getUrl(asset, t - interval, t);
        urls[url] = { url, params: { symbol_id: asset.symbol_id, interval: '1m' } };
      }
    }
    // const interval = 921600;
    // const hour = 3060;
    // const day = hour * 24;
    // const year = day * 365;
    // const tend = 1596150000; // Math.floor(new Date().getTime() / 1000 / day) * day;
    // // const tend = Math.floor(new Date().getTime() / 1000) - interval;
    // const tstart = tend - year;
    // for (let year = tend; year > tstart; year -= interval) {
    //   const _tend = year;
    //   const _tstart = _tend - interval;
    //   const url = `https:/}/tradinglite.com/api/heatmap?exchange=bitmex&symbol=XBTUSD&timeframe=60&mode=1&start=${_tstart}&end=${_tend}`;
    //   urls[url] = { url };
    // }
    cb(urls);
  },
  parseType: 'raw',
  periodInterval: 1000,
  models: [],
  // models: [bcoin_user],
  printInterval: 30,
  //
  parallN: 1,
};
