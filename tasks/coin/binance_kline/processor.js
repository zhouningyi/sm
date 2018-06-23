/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');
const { Binance } = require('./../exchanges');

// const ws = require('ws');

// async function loop(f) {
//   try {
//     await f();
//   } catch (e) {
//     console.log(e);
//   }
//   setTimeout(() => loop(f), 300);
// }

async function delay(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t);
  });
}

module.exports = (record, success, fail) => {
  const { future_kline_binance, kline_binance } = record.models;// ticks_history_binance

  const pairs = ['BTC-USDT', 'ETH-USDT'];
  const intervals = ['1m'];//

  const exchange = new Binance({});
  const oneMinute = 60 * 1000;
  const oneYear = oneMinute * 60 * 24 * 280;
  const endTimeR = new Date().getTime();
  const limitInterval = oneMinute * 499;
  const startTimeR = new Date(endTimeR - oneYear);
  const times = _.range(startTimeR, endTimeR, limitInterval);
  async function main() {
    for (let k = 0; k < intervals.length; k++) {
      const interval = intervals[k];
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        for (let j = 0; j < times.length; j++) {
          const startTime = times[j];
          const endTime = startTime + limitInterval;
          await runSpotTask(`${pair}`, interval, startTime, endTime);
        }
      }
    }
    process.exit();
  }

  async function runSpotTask(pair, interval, startTime, endTime) {
    console.log(`spot - ${interval} - ${pair} start`);
    const ds = await exchange.kline({ pair, interval, startTime, endTime });
    if (!ds)console.log('数据为空....');
    console.log(`spot - ${interval} - ${pair} end`);
    await Utils.batchUpsert(kline_binance, ds);
    console.log(`spot - ${interval} - ${pair} save`);
  }

  main();
};
