/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');
const vendor = require('./../tradinglites/vendor');
const influx_model = require('./../tradinglites/influx_model');
const argv = require('optimist').argv;

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

// const MODE = 'trade';
const MODE = argv.MODE || 'kline';

function parse(v) {
  if (typeof v === 'string') {
    if (v === 'NaN') return null;
    return parseFloat(v, 10);
  }
  if (isNaN(v)) return null;
  return v;
}

function parseKline(array, params) {
  const list = vendor.CandleResponse.decode(array);
  const { time, open, high, low, close, vbuy, vsell } = list;
  const res = [];
  for (let i = 0; i < time.length; i++) {
    res.push({
      ...params,
      time: new Date(time[i]),
      open: parse(open[i]),
      high: parse(high[i]),
      low: parse(low[i]),
      close: parse(close[i]),
      volume_long: parse(vbuy[i]),
      volume_short: parse(vsell[i]),
    });
  }
  return res.filter(d => d.open && d.high && d.close && d.low);
}

function parseVolumes(array, params) {
  const list = vendor.VolumeResponse.decode(array);
  const { datas, times } = list;
  const res = [];
  for (const i in datas) {
    const d = datas[i];
    const time = new Date(times[i]);
    const entry = vendor.VolumeEntry.decode(d);
    const { prices, buys, sells } = entry;
    if (!prices) continue;
    const volume_long = _.sumBy(buys, d => d);
    const volume_short = _.sumBy(sells, d => d);
    const price = _.sumBy(prices, d => d) / prices.length;
    // console.log(entry.time, 'entry.time....');
    if (!entry.time) continue;
    const detail = [];
    for (const i in prices) {
      detail.push([prices[i], buys[i], sells[i]]);
    }
    const l = {
      ...params,
      time,
      price,
      volume_long,
      volume_short,
      detail
    };
    res.push(l);
  }
  return res;
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
  let res;
  if (MODE === 'kline') {
    res = parseKline(array, params);
  } else if (MODE === 'trade') {
    console.log('parseVolumes.......');
    res = parseVolumes(array, params);
  }
  if (!res.length) return fail('最终数据为空...');
  if (res.length) {
    console.log(res[0].time, '=====');
    console.log(`start to store: ${res.length}条1...`);
    if (MODE === 'kline') await influx_model.kline1m.batchInsert(res);
    if (MODE === 'trade') await influx_model.trade1m.batchInsert(res);
  }
  console.log('done...');
  success(null);
};
