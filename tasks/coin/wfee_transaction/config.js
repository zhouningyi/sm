/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const list = require('./list');
const Utils = require('./../../../lib/utils');
const dblink = require('./../../../lib/dblink');
// /8D6E1YPS5PZUP3K9TRCHV7AKNKAP1WSM9K
function getUrl(d, i = 0) {
  const id = (d.address || '').toLowerCase();
  return `https://etherscan.io/token/generic-tokentxns2?contractAddress=0xa37adde3ba20a396338364e2ddb5e0897d11a91d&a=${id}&p=${i}&mode=`;
}
module.exports = {
  name: 'wfee_transaction',
  desc: 'wfee_transaction',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: async (cb, db_id) => {
    const urls = {};
    const q = {
      where: {
        balance: {
          $gte: 100 * 10000
        }
      }
    };
    const { data } = await dblink.findAll(db_id, 'public', 'wfee_balance', q);
    _.forEach(data, (d) => {
      for (let i = 1; i <= 3; i++) {
        const url = getUrl(d, i);
        const params = {
          address: d.address,
          name: d.name
        };
        urls[url] = { url, params };
      }
    });
    cb(urls);
  },
  parseType: 'dom',
  models: ['wfee_transaction', 'wfee_balance'],
  end: {
    type: 'restart',
    isUpdate: true,
    isClean: true,
  },
  timeout: 15000,
  printInterval: 1,
  parallN: 1,
};
