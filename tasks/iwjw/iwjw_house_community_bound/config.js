/**
 * 爬取配置
 */
const Models = require('./../../../../model');
// const cityList = require('./../utils/city');
// const _ = require('lodash');

const getURL = (id, g) => `https://www.iwjw.com/getPathInfo.action?g=${g}&id=${id}`;

module.exports = {
  name: 'iwjw_house_community_bound',
  desc: '爱屋及乌小区边界',
  // url 所需要的参数排列组合
  time: {
    value: 3,
    type: 'interval'
  },
  urls: (cb) => {
    Models.house_iwjw_community.findAll({
      attributes: ['community_id', 'g']
    }).then((ds) => {
      let url,
        urls = {};
      ds.map(d => d.dataValues).forEach((d) => {
        const { community_id, g } = d;
        const url = getURL(community_id, g);
        const params = { community_id };
        urls[url] = { url, params };
      });
      cb(urls);
    });
  },
  parallN: 10,
  // proxy: 'abu',
  //
  parseType: 'json',
  processing: require('./processer'),
  models: ['house_iwjw_community']
};
