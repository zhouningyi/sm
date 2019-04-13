/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const list = require('./list');
const Utils = require('./../../../lib/utils');
const dblink = require('./../../../lib/dblink');
// /8D6E1YPS5PZUP3K9TRCHV7AKNKAP1WSM9K
function getUrl(d) {
  const id = (d.address || '').toLowerCase();
  return `https://etherscan.io/token/0xa37adde3ba20a396338364e2ddb5e0897d11a91d?a=${id}`;
}
module.exports = {
  name: 'wfee',
  desc: 'wfee',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: async (cb, db_id) => {
    const urls = {};
    const q = {
      where: {
        $or: [{
          balance: {
            $gte: 100 * 1000
          }
        }, {
          balance: null
        }]
      }
    };
    const ds = _.map(list, (d) => {
      const address = d['持币地址'].toLowerCase();
      const name = d['地址说明'];
      if (name.indexOf('UP') !== -1) console.log(name, '地址说明');
      return {
        unique_id: address,
        address,
        name
      };
    });
    let data;
    try {
      await dblink.batchUpsert(db_id, 'public', 'wfee_balance', ds);
      const { data: d } = await dblink.findAll(db_id, 'public', 'wfee_balance', q);
      data = d;
    } catch (e) {
      data = ds;
    }
    _.forEach(data, (d) => {
      const url = getUrl(d);
      const params = {
        address: d.address,
        name: d.name
      };
      urls[url] = { url, params };
    });
    cb(urls);
  },
  parseType: 'dom',
  models: ['wfee_balance_history', 'wfee_balance'],
  end: {
    type: 'restart',
    isUpdate: true,
    isClean: true,
  },
  printInterval: 1,
  parallN: 1,
};
