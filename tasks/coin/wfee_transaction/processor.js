/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');

function getNumber(v) {
  return v.replace(/^\D+/g, '');
}

module.exports = async (record, success, fail) => {
  const { $, url, tables, params, body } = record;// ticks_history_binance
  const { wfee_balance, wfee_transaction } = tables;
  //
  const totalTbody = $('#maindiv').find('tbody');
  const trs = totalTbody.find('tr');
  const trxs = [];
  const ads = {};
  trs.each((i, tr) => {
    if (i > 0) {
      tr = $(tr);
      const tds = tr.find('td');
      const txid = $(tds[0]).find('a').text();
      const span = $(tds[1]).find('span');
      const timeStr = span.attr('title') || span.attr('original-title');
      const time = new Date(timeStr);
      const source = $(tds[2]).text();
      const target = $(tds[4]).text();
      ads[source] = true;
      ads[target] = true;
      const amountStr = $(tds[5]).text();
      const amount = parseFloat(amountStr.replace(/,/g, ''), 10);
      const trx = {
        unique_id: txid, txid, source, target, time, amount
      };
      if (amount) trxs.push(trx);
    }
  });
  console.log(`trxs.length: ${trxs.length}...`);
  const addresses = _.keys(ads).filter(d => d).map(address => ({ unique_id: address, address }));
  const t1 = Utils.batchUpsert(wfee_transaction, trxs);
  const t2 = Utils.batchUpsert(wfee_balance, addresses);
  await Promise.all([t1, t2]);
  setTimeout(() => success(), 4000);
};
