/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const _ = require('lodash');
const sequelize = require('./../../../../model').sequelize;

const getURL = (adcode, range) => {
  return `http://ajax.lianjia.com/ajax/mapsearch/area/community?min_longitude=${range.lngmin}&max_longitude=${range.lngmax}&min_latitude=${range.latmin}&max_latitude=${range.latmax}&&city_id=${adcode}`;
};

const adcodes = {
  110100: 110000,
  310100: 310000,
  500100: 500000,
  120100: 120000
};

const getRange = (geom) => {
  const coords = JSON.parse(geom).coordinates[0];
  const lngmin = _.min(coords.map(d => d[0]));
  const lngmax = _.max(coords.map(d => d[0]));
  const latmin = _.min(coords.map(d => d[1]));
  const latmax = _.max(coords.map(d => d[1]));
  return { lngmin, lngmax, latmin, latmax };
};

module.exports = {
  version: 2,
  name: 'house_lianjia_community_by_latlng_interval',
  desc: '链家网 全国小区',
  time: {
    type: 'interval',
    value: 10
  },
  urls (cb) {
      const sql = `
      SELECT ST_AsGeojson(ST_Envelope(polygon)) as bound,  substring(adcode, 1, 4) || '00' AS adcode
      FROM house_lianjia_plates
      WHERE polygon IS NOT NULL
    `;

    sequelize.query(sql).then(ds => {
      const urls = {};
      ds[0].forEach(d => {
        let {adcode, bound} = d;
        if (adcodes[adcode]) adcode = adcodes[adcode];
        let range = getRange(bound);
        let url  = getURL(adcode, range);
        urls[url] = {url};
      });
      cb(urls);
    });
  },
  parseType: 'json',
  processing: require('./processor'),
  //
  parallN: 5,
  queryInterval: 0,
  periodInterval: 1500,
  models: ['house_lianjia_community'],
  printInterval: 10
};
