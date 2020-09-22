/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');
const influx_model = require('./influx_model');

function _parse(v) {
  return parseFloat(v, 10);
}


module.exports = async (record, success, fail) => {
  const { body, json, params } = record;
  if (!body) return fail('返回为空...');
  if (body && body.length) {
    const blen = body.length;
    if (blen < 10) {
      console.log(body, '====dsd');
      return fail('返回太短...');
    }
  }
  const res = _.map(json, (d) => {
    const ratio = d.side === 'Buy' ? 1 : -1;
    return {
      ...params,
      time: new Date(d.timestamp),
      amount: d.size * ratio,
      amount_usd: d.foreignNotional * ratio,
      price: d.price,
      order_id: d.trdMatchID
    };
  });

  if (res.length) {
    console.log(`start to store: ${res.length}`);
    await influx_model.trade.batchInsert(res);
    setTimeout(() => success(null), 2000);
  }
};
