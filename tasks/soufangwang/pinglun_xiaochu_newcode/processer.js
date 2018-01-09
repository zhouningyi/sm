/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');

module.exports = function(record, success, fail) {
  const Models = record.models;
  const model = Models.soufang_community;
  const community_comment_url = record.url;
  let community_id = Utils.cut(record.body, 'newcode = "', `";`, false)
  if (!community_id) return fail('没community_id', community_comment_url);
  community_id = community_id.split('\n')[0]
  .replace(/\"/g, '').replace(/\;/g, '');
  //
  model.upsert({
    community_comment_url,
    community_id
  })
  return success(null);
};
