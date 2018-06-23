/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');
const { Okex } = require('./../exchanges');

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
  const { future_kline_okex, kline_okex } = record.models;// ticks_history_binance

  const pairs = ['BTC-USD', 'LTC-USD', 'ETH-USD', 'ETC-USD', 'BCH-USD', 'XRP-USD', 'EOS-USD', 'BTG-USD'];
  const contract_types = ['this_week', 'next_week', 'quarter'];
  const intervals = ['1m', '3m', '15m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'];//

  const okex = new Okex({});

  async function main() {
    for (let k = 0; k < intervals.length; k++) {
      const interval = intervals[k];
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        await runSpotTask(`${pair}T`, interval);
        for (let j = 0; j < contract_types.length; j++) {
          const contract_type = contract_types[j];
          await runFutureTask(pair, contract_type, interval);
        }
      }
    }
    process.exit();
  }

  async function runFutureTask(pair, contract_type, interval) {
    console.log(`${contract_type} - ${interval} - futrue ${pair} start`);
    const isUSDT = true;
    const ds = await okex.futureKline({ contract_type, pair, interval, isUSDT });
    console.log(`${contract_type} - ${interval} - futrue ${pair} end`);
    await Utils.batchUpsert(future_kline_okex, ds);
    console.log(`${contract_type} - ${interval} - futrue ${pair} save`);
  }

  async function runSpotTask(pair, interval) {
    console.log(`spot - ${interval} - ${pair} start`);
    const ds = await okex.kline({ pair, interval });
    console.log(`spot - ${interval} - ${pair} end`);
    await Utils.batchUpsert(kline_okex, ds);
    console.log(`spot - ${interval} - ${pair} save`);
  }

  main();

  // okex.wsTicks({}, async (ds) => {
  //   console.log('binance...');
  //   await upsert(ds, 'binance');
  // });


  // const kucoin = new Kucoin({});
  // loop(async () => {
  //   console.log('kucoin...');
  //   const ds = await kucoin.ticks();
  //   await upsert(ds, 'kucoin');
  // });
  // //
  // const hitbtc = new Hitbtc({});
  // setTimeout(() => loop(async () => {
  //   console.log('Hitbtc...');
  //   const ds = await hitbtc.ticks();
  //   await upsert(ds, 'hitbtc');
  // }), 1000);
  // //
  // const okex = new Okex({});
  // okex.wsTicks({}, async (ds) => {
  //   console.log('okex...');
  //   await upsert(ds, 'okex');
  // });
  // //
  // const bittrex = new Bittrex({});
  // setTimeout(() => loop(async () => {
  //   console.log('Bittrex...');
  //   const ds = await bittrex.ticks();
  //   await upsert(ds, 'bittrex');
  // }), 1000);
};
