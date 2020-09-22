/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');

function _parse(v) {
  return parseFloat(v, 10);
}

module.exports = (record, success, fail) => {
  const { json, params } = record;
  if (!json) return fail('no json...');
  const { data, code } = json;
  if (!data) return fail('no data...');
  if (code !== 0) return fail(`code:${code}...`);
  const { benifitModels } = data;
  const userId = params.id;

  const line = {
    ...params,
    unique_id: userId,
    pic_url: data.userPic,
  };
  const benifit_history = _.map(benifitModels, (l) => {
    return {
      unique_id: userId + l.ctime,
      user_id: userId,
      time: new Date(l.ctime),
      balance: _parse(l.income)
    };
  });
  console.log(line, benifit_history, data, 'line...');
  // record.models.bcoin_user.upsert(line).then(() => {});
  // success(null);
};
