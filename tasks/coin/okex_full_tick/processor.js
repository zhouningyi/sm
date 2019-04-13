/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');
const md5 = require('md5');
const { OkexV3 } = require('./../exchanges');

const deepmerge = require('deepmerge');
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
  const { full_tick, full_tick_history } = record.models;// ticks_history_binance

  const pair2coin = pair => pair.split('-')[0].toUpperCase();

  const inst = new OkexV3();
  async function main() {
    const pairs = ['ETC-USD', 'EOS-USD', 'ETH-USD', 'BTC-USD', 'LTC-USD', 'XRP-USD'];
    const pairsSpot = pairs.map(d => `${d}T`);
    //
    const datas = {
    };
    inst.wsFutureDepth({ size: 5, pairs, contract_type: ['quarter', 'this_week', 'next_week'] }, (ds) => {
      _.forEach(ds, (d) => {
        const { contract_type, pair, bids, asks, time } = d;
        const bid1 = bids[0];
        const ask1 = asks[0];
        const bid_price = bid1.price;
        const bid_volumn = bid1.volume_amount;
        const ask_price = ask1.price;
        const ask_volumn = ask1.volume_amount;
        const coin = pair2coin(pair);
        const line = {
          coin,
          [`${contract_type}_bid_price`]: bid_price,
          [`${contract_type}_bid_volumn`]: bid_volumn,
          [`${contract_type}_ask_price`]: ask_price,
          [`${contract_type}_ask_volumn`]: ask_volumn,
          time
        };
        datas[coin] = deepmerge(datas[coin] || {}, line);
      });
    });

    inst.wsDepth({ size: 5, pairs: pairsSpot }, (ds) => {
      _.forEach(ds, (d) => {
        const { pair, bids, asks, time } = d;
        const bid1 = bids[0];
        const ask1 = asks[0];
        const bid_price = bid1.price;
        const bid_volumn = bid1.volume;
        const ask_price = ask1.price;
        const ask_volumn = ask1.volume;
        const coin = pair2coin(pair);
        const line = { coin, bid_price, bid_volumn, ask_price, ask_volumn, time };
        datas[coin] = deepmerge(datas[coin] || {}, line);
      });
    });

    inst.wsFutureIndex({ pairs }, (ds) => {
      _.forEach(ds, (d) => {
        const { pair, price: index, time } = d;
        const coin = pair2coin(pair);
        const line = { coin, index, time };
        datas[coin] = deepmerge(datas[coin] || {}, line);
      });
    });

    inst.wsFutureTicks({ pairs, contract_type: ['quarter', 'this_week', 'next_week'] }, (ds) => {
      _.forEach(ds, (d) => {
        const { pair, hold_amount, contract_type, time } = d;
        const coin = pair2coin(pair);
        const line = { [`${contract_type}_hold_amount`]: hold_amount, time, coin };
        datas[coin] = deepmerge(datas[coin] || {}, line);
      });
    });

    function extractCurrent() {
      const lines = [];
      _.forEach(datas, d => lines.push({ ...d, unique_id: d.coin }));
      console.log('interval...', lines.length);
      Utils.batchUpsert(full_tick, lines);
    }

    async function spotSwapPrice() {
      try {
        const ds = await inst.swapTicks();
        _.forEach(ds, (d) => {
          const coin = pair2coin(d.pair);
          const line = { swap_price: d.last_price };
          datas[coin] = deepmerge(datas[coin] || {}, line);
        });
      } catch (e) {
      }
    }

    function extractHistory() {
      const lines = [];
      _.forEach(datas, (d) => {
        const t = Math.floor(d.time.getTime() / 1000);
        const unique_id = d.coin + t;
        lines.push({ ...d, unique_id });
      });
      Utils.batchUpsert(full_tick_history, lines);
    }

    function interval(fn, t) {
      try {
        fn();
      } catch (e) {
      }
      setTimeout(() => interval(fn, t), t);
    }
    interval(extractCurrent, 1000);
    interval(extractHistory, 2000);
    // interval(spotSwapPrice, 3000);
  }

  main();
};
