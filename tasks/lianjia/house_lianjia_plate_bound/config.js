/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const Models = require('./../../../../model');

const getURL = adcode => `http://ajax.lianjia.com/ajax/mapsearch/area/bizcircle?city_id=${adcode}`;

module.exports = {
  version: 2,
  name: 'house_lianjia_plate_bound',
  desc: '链家网 板块边界',
  time: {
    type: 'interval',
    value: 1
  },
  urls(cb) {
    Models.house_lianjia_city.findAll({}).then((ds) => {
      const urls = {};
      ds.forEach((d) => {
        let url = getURL(d.adcode);
        urls[url] = { url };
        // 济南的特殊情况
        url = getURL(`${d.adcode.toString().substring(0, 5)}1`);
        urls[url] = { url };
      });
      cb(urls);
    });
  },
  parseType: 'json',
  processing: require('./processor'),
  //
  poolSize: 1,
  queryInterval: 0,
  periodInterval: 1500,
  models: ['house_lianjia_plate']
};
