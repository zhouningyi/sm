/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');
const _ = require('lodash');

module.exports = function(record, success, fail) {
  const Models = record.models;
  const model = Models.soufang_pinglun;
  const { list } = record.json;
  const { community_id } = record.params;
  _.forEach(list, (d) => {
    const result = {
      community_id,
      channelname: d.channelname,
      comment: d.content,
      comment_id: d.id,
      username: d.username,
      user_id: d.user_id,
      agree_num: d.agree_num,
      disagree_num: d.disagree_num,
      create_time: new Date(d.create_time),
      update_time: new Date(d.update_time),
      ip: d.create_ip,
      community_name: d.projname,
      editor_type: d.editor_type,
      lat: d.coord_y,
      lng: d.coord_x,
      phone_number: d.telephone,
      from_type: d.fromtype,
      price_score: parseInt(d.dianping_score1, 10),
      area_score: parseInt(d.dianping_score2, 10),
      traffic_score: parseInt(d.dianping_score3, 10),
      supporting_score: parseInt(d.dianping_score4, 10),
      environment_score: parseInt(d.dianping_score5, 10),
      star_num: parseInt(d.star_num, 10),
      tags: d.tag.split(',')
    };
    model.upsert(result);
  })
  
  return setTimeout(d => success(null), 100);
};
