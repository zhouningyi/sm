/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const Utils = require('./../../../lib/utils');
// const { bcoin_user } = require('./../exchanges/schemas');


function isFuture(asset_type) {
  return ['next_quarter', 'quarter', 'next_week', 'this_week'].includes(asset_type);
}

function getCoinApiSymbolId({ asset_type, pair, exchange }) {
  // asset_type 可取 next_quarter, quarter, next_week, this_week, swap, spot
  const symbol_id = pair.replace('-', '_');

  let type;
  const extra_string = null;
  asset_type = asset_type.toLowerCase();
  if (asset_type === 'spot') {
    type = 'SPOT';
  } else if (asset_type === 'swap') {
    type = 'PERP';
  } else if (isFuture(asset_type)) {
    type = asset_type.toUpperCase();
  } else {
    console.log('getCoinApiSymbolId/asset_type未知');
  }
  return [exchange, type, symbol_id, extra_string].filter(d => d).map(str => str.toUpperCase()).join('_');
}

function getAssets() {
  const list = [
    // BITMEX
    ['BTC-USD', 'SWAP', 'BITMEX', 'XBTUSD'],
    ['ETH-USD', 'SWAP', 'BITMEX', 'ETHUSD'],
    // BITFINEX
    ['ETH-USD', 'SPOT', 'BITFINEX', 'ETHUSD'],
    ['BTC-USD', 'SPOT', 'BITFINEX', 'BTCUSD'],
    // // 币安
    ['BTC-USDT', 'SPOT', 'BINANCE', 'BTCUSDT'],
    ['BTC-USDT', 'SWAP', 'BINANCE', 'BTCUSDT', 'binancef'],
    ['ETH-USDT', 'SPOT', 'BINANCE', 'ETHUSDT'],
    ['ETH-USDT', 'SWAP', 'BINANCE', 'ETHUSDT', 'binancef'],
    // // BITSTAMP
    ['ETH-USD', 'SPOT', 'BITSTAMP', 'ETHUSD'],
    ['BTC-USD', 'SPOT', 'BITSTAMP', 'BTCUSD'],
    // // COINBASE
    ['BTC-USD', 'SPOT', 'COINBASE', 'BTC-USD'],
    // // OKEX
    ['ETH-USDT', 'SPOT', 'OKEX', 'ETH-USDT'],
    ['ETH-USD', 'QUARTER', 'OKEX', 'ETH-USD', 'okexf'],
    ['BTC-USDT', 'SPOT', 'OKEX', 'BTC-USDT'],
    ['BTC-USD', 'QUARTER', 'OKEX', 'BTC-USD', 'okexf'],
    ['EOS-USD', 'QUARTER', 'OKEX', 'EOS-USD', 'okexf'],
    ['BSV-USD', 'QUARTER', 'OKEX', 'BSV-USD', 'okexf'],
    //
  ];
  return list.map((l) => {
    const [pair, asset_type, exchange, tradinglite_id] = l;
    const exchangef = l[4] || exchange;
    const symbol_id = getCoinApiSymbolId({ asset_type, pair, exchange });
    return { symbol_id, tradinglite_id, exchange: exchangef };
  });
}

const timeConfig = {
  interval: 15360,
  timeend: 1598235180
};

// const cookie = '_ga=GA1.2.1501744131.1592143406; __stripe_mid=b6995969-6288-456f-a817-98f7b6b859bf; apiKey=fca67203-d339-5fab-bfe6-c85d74cf666f; _gid=GA1.2.149458626.1596563448; access-token=rYW3rsb76OLEN6N2; accountId=5ee62f6f4b88746d7c2dee5f';
const cookie = '_ga=GA1.2.1501744131.1592143406; __stripe_mid=b6995969-6288-456f-a817-98f7b6b859bf; apiKey=fca67203-d339-5fab-bfe6-c85d74cf666f; access-token=rYW3rsb76OLEN6N2; accountId=5ee62f6f4b88746d7c2dee5f; _gid=GA1.2.563857995.1598250471';
module.exports = {
  cookie,
  timeConfig,
  getAssets,
  getCoinApiSymbolId,
  isFuture
}
;
