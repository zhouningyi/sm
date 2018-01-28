/**
 * 爬取配置
 */
const Models = require('./../../../../model');
const cityList = require('./../utils/city');
const _ = require('lodash');

const cityObj = _.keyBy(cityList, d => d.adcode);

const getRange = (geom) => {
  const coords = JSON.parse(geom).coordinates[0];
  const lngmin = _.min(coords.map(d => d[0]));
  const lngmax = _.max(coords.map(d => d[0]));
  const latmin = _.min(coords.map(d => d[1]));
  const latmax = _.max(coords.map(d => d[1]));
  return { lngmin, lngmax, latmin, latmax };
};

const getURL = (r, id) => `https://www.iwjw.com/houseMarkByLevel.action?lngF=${r.lngmin}&lngT=${r.lngmax}&latF=${r.latmin}&latT=${r.latmax}&p=${id}&ht=2&zoom=17`;

module.exports = {
  name: 'iwjw_house_community',
  desc: '链家网小区边界',
  // url 所需要的参数排列组合
  time: {
    value: 3,
    type: 'interval'
  },
  urls: (cb) => {
    const sql = `
      SELECT ST_AsGeojson(ST_Envelope(polygon)) as bound, adcode as district_adcode
      FROM areas
      WHERE polygon IS NOT NULL
      AND(
      ${cityList.map(d => `adcode LIKE '${d.adcode.toString().substring(0, 4)}%'`).join(`
        OR `)
      }
      )
      AND level='district'
    `;
    Models.sequelize.query(sql).then((ds) => {
      let url,
        urls = {};
      ds[0].forEach((d) => {
        const { bound, district_adcode } = d;
        const range = getRange(bound);
        const citycode = `${district_adcode.substring(0, 4)}00`;
        const id = cityObj[citycode].id;
        const params = { district_adcode };
        const url = getURL(range, id);
        urls[url] = {
          url,
          params
        };
      });
      cb(urls);
    });
  },
  parallN: 1,
  // proxy: 'abu',
  //
  parseType: 'json',
  processing: require('./processor'),
  models: ['house_iwjw_community']
};
