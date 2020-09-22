/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');
const vendor = require('./vendor.js');
const influx_model = require('./influx_model');

function _parse(v) {
  return parseFloat(v, 10);
}

function parse_heat_list(heat_list) {
  const entries = heat_list.entries;

  const result = [];

  for (const heat of entries) {
    const entry = vendor.HeatmapEntry.decode(heat);
    result.push(entry);
  }

  return result;
}

module.exports = async (record, success, fail) => {
  const { body, params } = record;
  if (!body) return fail('返回为空...');
  if (body && body.length) {
    const blen = body.length;
    if (blen < 100) {
      console.log(body, '====dsd');
      return fail('返回太短...');
    }
  }


  // const buffer = Buffer.from('body');
  const array = new Uint8Array(body);
  const heat_list = vendor.HeatmapResponse.decode(array);
  const heat_result = parse_heat_list(heat_list);
  const l0 = heat_result[0];
  const res = [];
  _.forEach(heat_result, (l) => {
    const { values, time, priceGroup, ...rest } = l;
    const vl = values.length;
    if (!vl) return;
    let bids = [];
    let asks = [];
    for (let i = 0; i <= vl / 2; i += 1) {
      const price = values[2 * i];
      const volume = values[2 * i + 1];
      if (volume < 0) {
        asks.push([price, volume]);
      } else {
        bids.push([price, volume]);
      }
    }
    bids = _.sortBy(bids, l => -l[0]);
    asks = _.sortBy(asks, l => l[0]);
    const bid_price1 = bids[0] ? bids[0][0] : null;
    const bid_volume1 = bids[0] ? bids[0][1] : null;
    const ask_price1 = asks[0] ? asks[0][0] : null;
    const ask_volume1 = asks[0] ? asks[0][1] : null;
    res.push({ ...params, bids: JSON.stringify(bids), asks: JSON.stringify(asks), bid_price1, bid_volume1, ask_price1, ask_volume1, time: new Date(time) });
  });

  if (!res.length) return fail('最终数据为空...');

  console.log(res[0].bid_price1, params, 'data...');
  if (res.length) {
    console.log('start to store');
    await influx_model.depth1m.batchInsert(res);
  }
  console.log('done...');
  // console.log(heat_result[0].values, 12122);
  // if (!json) return fail('no json...');
  // const { data, code } = json;
  // if (!data) return fail('no data...');
  // if (code !== 0) return fail(`code:${code}...`);
  // const { benifitModels } = data;
  // const userId = params.id;

  // const line = {
  //   ...params,
  //   unique_id: userId,
  //   pic_url: data.userPic,
  // };
  // const benifit_history = _.map(benifitModels, (l) => {
  //   return {
  //     unique_id: userId + l.ctime,
  //     user_id: userId,
  //     time: new Date(l.ctime),
  //     balance: _parse(l.income)
  //   };
  // });
  // console.log(line, benifit_history, data, 'line...');
  // // record.models.bcoin_user.upsert(line).then(() => {});
  success(null);
};
