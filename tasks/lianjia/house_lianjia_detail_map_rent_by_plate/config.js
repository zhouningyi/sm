/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const sequelize = require('./../../../../model').sequelize;

const limit = 200;
const getURL = (adcode, plate_id, offset) => {
  return `http://ajax.lianjia.com/ajax/housesell/area/bizcircleZufang?ids=${plate_id}&limit_offset=${offset}&limit_count=${limit}&city_id=${adcode}`;
};

const genURLs = (adcode, plate_id, selling_count, urls) => {
  for (let offset = 0; offset <= selling_count; offset += limit) {
    const url = getURL(adcode, plate_id, offset);
    urls[url] = { url };
  }
};

const adcodes = {
  110100: 110000,
  310100: 310000,
  500100: 500000,
  120100: 120000
};

module.exports = {
  version: 2,
  name: 'house_lianjia_detail_map_rent_by_plate',
  desc: '链家网 全国租房详细交易(除了上海)',
  time: {
    type: 'interval',
    value: 1
  },
  urls(cb) {
    sequelize.query(`
      SELECT plate_id, adcode, selling_count
      FROM house_lianjia_plates
      WHERE adcode IS NOT NULL
    `).then((ds) => {
      const urls = {};
      ds[0].forEach((d) => {
        let { adcode } = d;
        adcode = `${adcode.toString().substring(0, 4) }00`;
        if (adcodes[adcode]) adcode = adcodes[adcode];
        return genURLs(adcode, d.plate_id, d.selling_count || 0, urls);
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
  models: ['house_lianjia_details_rent_byplate', 'house_lianjia_details_rent_byplate_history'],
  printInterval: 10
};
