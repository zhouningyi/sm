/**
 * 爬取配置
 */
const Utils = require('./../../../lib/utils');
const Models = require('./../../../model');
const dblink = require('./../../../lib/dblink');
const _ = require('lodash');

function getURL(pinyin) {
  return `https://${pinyin}.lianjia.com/ditu/`;
}

module.exports = {
  version: 2,
  name: 'house_lianjia_plate_bound',
  desc: '链家网 板块边界',
  time: {
    type: 'interval',
    value: 1
  },
  urls(cb, db_id) {
    dblink.findAll(db_id, 'public', 'house_lianjia_cities', { where: {
      // adcode: {
      //   $like: '31%'
      // }
    } }).then((ds) => {
      const urls = {};
      _.forEach(ds.data, (d) => {
        const url = getURL(d.pinyin);
        urls[url] = { url };
      });
      cb(urls);
    });
  },
  browser: {
    type: 'chrome',
    options: {
      viewport: {
        width: 2000,
        height: 1800,
        deviceScaleFactor: 0.3
      }
    },

    operate: async (page) => {
      const ds = await page.$$('.BMapLabel');
      if (!ds || !ds.length) return;
      page.click('.BMapLabel ');// 点击聚类后放大
      await Utils.delay(5000);
    },
    output: {
      type: 'script',
      filter: resp => resp.url.indexOf('biz') !== -1
    }
  },
  parseType: 'json',
  processing: require('./processor'),
  //
  parallN: 3,
  queryInterval: 0,
  periodInterval: 1500,
  models: ['house_lianjia_plates']
};
