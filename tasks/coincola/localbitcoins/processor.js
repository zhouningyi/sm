/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');


function getUrl(relPath) {
  return `https://coinmarketcap.com${relPath}`;
}

function getUserId(str) {
  if (!str) return null;
  return str.replace(/\/user\//, '');
}

function getNumber(str) {
  if (!str) return null;
  let price = str.replace(/,/g, '');
  price = price.replace(/\$/g, '');
  return parseFloat(price, 10);
}

function _parse(t) {
  return parseFloat(t, 10);
}


module.exports = async (record, success, fail) => {
  const { json } = record;
  const { localbitcoins } = record.models;
  if (json.data.ad_list.length > 0) {
    const data = json.data.ad_list.map((t, i) => Object.assign({}, t.data,
      {
        profile: t.data.profile,
        platform: 'localbitcoins',
        unique_id: t.data.ad_id,
        created_time: t.data.created_at,
        temp_price_usd: _parse(t.data.temp_price_usd)
      }));
    const url = json.pagination.next;
    if (json.pagination.next) {
      await record.urlModel.upsert([{ url }]);
    }
    await Utils.batchUpsert(localbitcoins, data);
  }
  success();
};
