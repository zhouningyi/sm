/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');
const { Binance, Kucoin, Okex, Hitbtc, Bittrex } = require('./../exchanges');

// const ws = require('ws');

async function loop(f) {
  try {
    await f();
  } catch (e) {
    console.log(e);
  }
  setTimeout(() => loop(f), 300);
}

async function delay(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t);
  });
}

function processData(ds, name, ishistory = false) {
  return _.map(ds, (d) => {
    d.exchange = name;
    const tick_id = `${d.pair}_${name}`;
    d.unique_id = ishistory ? `${tick_id}_${d.time.getTime() % 1000000}` : tick_id;
    return d;
  });
}

module.exports = (record, success, fail) => {
  const { future_kline_okex, kline_okex } = record.models;// ticks_history_binance
  //
  async function upsert(ds, name) {
    await Promise.all([
      Utils.batchUpsert(ticks, processData(ds, name)),
      Utils.batchUpsert(ticks_history, processData(ds, name, true))
    ]);
  }

  const pairs = ['BTC-USD', 'LTC-USD', ' ETH-USD', 'ETC-USD', 'BCH-USD', 'XRP-USD', 'EOS-USD', 'BTG-USD'];
  const contact_types = ['this_week', 'next_week', 'quarter'];

  const okex = new Okex({});
  _.forEach(pairs, (pair) => {
    _.forEach(contact_types, (contact_type) => {
      runTask(pair, contact_type);
    });
  });

  async function runTask(pair, contact_type) {
    const ds = await okex.kline({
      contact_type, pair
    });
  }
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
