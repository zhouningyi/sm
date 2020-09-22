/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');
const { Huobi } = require('./../exchanges');

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

module.exports = async (record, success, fail) => {
  const { huobi_kline } = record.models;// ticks_history_binance

  // const pairs = ['BTC-USDT', 'ETH-USDT'];
  const intervals = ['15m'];//

  const exchange = new Huobi({
  });
  const pairs = await exchange.pairs();
  // const oneMinute = 60 * 1000;
  // const oneYear = oneMinute * 60 * 24 * 280;
  // const endTimeR = new Date().getTime();
  // const limitInterval = oneMinute * 499;
  // const startTimeR = new Date(endTimeR - oneYear);
  // const times = _.range(startTimeR, endTimeR, limitInterval);
  async function main() {
    for (let k = 0; k < intervals.length; k++) {
      const interval = intervals[k];
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].pair;
        try {
          await runSpotTask(`${pair}`, interval);
        } catch (e) {
          console.log(e);
        }
      }
    }
    process.exit();
  }
  await main();

  async function runSpotTask(pair, interval) {
    console.log(`spot - ${interval} - ${pair} start`);
    const ds = await exchange.spotKline({ pair, interval, size: 2000 });
    if (!ds)console.log('数据为空....');
    // console.log(huobi_kline, '.d..huobi_kline.s');
    console.log(`spot - ${interval} - ${pair} end`);
    await Utils.batchUpsert(huobi_kline, ds);
    console.log(`spot - ${interval} - ${pair} save`);
  }
};
