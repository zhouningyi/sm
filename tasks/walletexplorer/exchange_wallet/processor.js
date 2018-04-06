/**
 *处理方法
 */
const dbUtils = require('./../../../lib/dblink/utils');
const Utils = require('./../../../lib/utils');
const _ = require('lodash');
const md5 = require('md5');

module.exports = (record, success, fail) => {
  const { tables, $, body, params } = record;
  const tbody = $('.txs').find('tbody');
  //
  const result = [];
  function processNode(i, node) {
    node = $(node);
    const tstr = node.find('.date').text();
    const time = new Date(tstr);
    const balanceStr = $(node.children('.amount')).text();
    const balance = parseFloat(balanceStr, 10);
    const transaction_id = node.find('.txid').text();
    const line = {
      time,
      balance,
      transaction_id,
    };
    node.find('.inout').find('tr').each((idx, nde) => {
      nde = $(nde);
      const wallethref = nde.find('.walletid').find('a').attr('href');
      const wallet_id = (wallethref || '').replace(/\/wallet\//g, '');
      const amount = parseFloat(nde.find('.amount').text(), 10);
      const lineNew = {
        unique_id: `${wallet_id}_${tstr}`,
        ...line,
        wallet_id,
        amount
      };
      result.push(lineNew);
    });
  }
  tbody.find('.received').each(processNode);
  tbody.find('.sent').each(processNode);
  //
  // console.log(result);
  // success(null);
  dbUtils.batchUpsert(tables.exchange_wallet_bittrex, result)
  .then(() => {
    success(null);
  })
  .catch((e) => {
    console.log(e);
    return fail('xx原因');
  });
};
