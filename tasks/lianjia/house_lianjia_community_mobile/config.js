/**
 * 爬取配置
 */
var Utils = require('./../../../../lib/utils');
var Models = require('./../../../../model');
var headers = require('./headers');

const adcodes = {
  110100: 110000,
  310100: 310000,
  500100: 500000,
  120100: 120000
};

const getURL = (id, adcode) => `http://m.api.lianjia.com/house/community/market?community_id=${id}&city_id=${adcode}`;

module.exports = {
  name: 'house_lianjia_community_mobile',
  desc: '链家网手机交易列表页, 小区详情',
  // headers: headers,
  time: {
    value: 10,
    type: 'interval'
  },
  urls: function (cb) {
    const sql = `
      SELECT community_id, substring(district_adcode, 1, 4) || '00' AS adcode
      FROM house_lianjia_communities
      WHERE district_adcode NOT LIKE '310%'
    `;
    Models.sequelize.query(sql).then(ds => {
       var url, d, district_adcode, dclone, urls = {};
       ds[0].forEach(d => {
         let {adcode, community_id} = d
         adcode = adcodes[adcode] || adcode;
         const url = getURL(community_id, adcode);
         const params = {community_id, adcode}
         urls[url] = {url, params};
       })
       cb(urls);
    });
  },
  parseType: 'json',
  processing: require('./processer'),
  models: ['house_lianjia_community', 'house_lianjia_community_status_history_lianjia', 'agent_info'],
  //
  parallN: 20,
  interval: 100,
};
