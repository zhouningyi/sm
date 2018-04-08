/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');
const { Binance, Kucoin, Okex } = require('exchanges');

// const ws = require('ws');

async function loop(f) {
  await f();
  setTimeout(() => loop(f), 200);
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
  const { ticks, ticks_history } = record.tables;// ticks_history_binance
  //
  async function upsert(ds, name) {
    await Promise.all([
      Utils.batchUpsert(ticks, processData(ds, name)),
      Utils.batchUpsert(ticks_history, processData(ds, name, true))
    ]);
  }
  //
  const binance = new Binance({});
  binance.wsTicks({}, async (ds) => {
    console.log('binance...');
    await upsert(ds, 'binance');
  });
  //
  const kucoin = new Kucoin({});
  loop(async () => {
    console.log('kucoin...');
    const ds = await kucoin.ticks();
    await upsert(ds, 'kucoin');
  });
  //
  const okex = new Okex({});
  okex.wsTicks({}, async (ds) => {
    console.log('okex...');
    await upsert(ds, 'okex');
  });
};
