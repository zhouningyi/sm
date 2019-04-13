/**
 *处理方法
 */
const Utils = require('./../../../lib/dblink/utils');
const _ = require('lodash');

function getNumber(v) {
  return v.replace(/^\D+/g, '');
}

module.exports = async (record, success, fail) => {
  const { $, url, tables, params } = record;// ticks_history_binance
  const { wfee_balance_history, wfee_balance, wfee_transaction } = tables;
  //
  const totalTbody = $('#ContentPlaceHolder1_divSummary').find('tbody');
  const balanceTd = totalTbody.find('#ContentPlaceHolder1_tr_tokenHolders').find('td');
  const balanceStr = $(balanceTd[1]).text().replace(/,/g, '');
  const balance = parseFloat(balanceStr, 10);
  // const transfersStr = $('#totaltxns').text();// .replace(/,/g, '');
  // console.log(transfersStr, 'transfersTd...');
  const line = {
    ...params,
    url,
    balance,
    time: new Date()
  };
  const { address } = params;
  const t1 = Utils.batchUpsert(wfee_balance, [{ ...line, unique_id: address }]);
  const t2 = Utils.batchUpsert(wfee_balance_history, [{ ...line, unique_id: `${address}_${balance}` }]);
  await Promise.all([t1, t2]);
  setTimeout(() => success(), 4000);
};
