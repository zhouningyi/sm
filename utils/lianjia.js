/**
 *处理方法
 */

var Utils = require('./../../lib/utils');

function getNumber(str) {
  if (!str) return;
  var arr = str.match(/\d+(\.\d+)?/);
  if (!arr) return;
  return parseInt(arr[0]);
}

function getURL(href, distr) {
  if (!href) return false;
  if (href.substring(0, 4) === 'http') return href;
  var body = 'http://' + distr + '.lianjia.com';
  return body + href;
}

function hasNumber(str) {
  if (!str) return false;
  var re = /\d+/;
  return re.test(str);
}

function recordUrls(record) {
  var $ = record.$;
  var Models = record.models;

  var url = record.url;
  var distr = Utils.cut(url, 'http://', '.lianjia.com');

  var ass = $('body').find('a');
  var ii = 0;
  var trade_id;
  var trade_ids = {};
  ass.each(function(a, b) {
      if (ii++ === 1) console.log('-ok-');
      var href = $(b).attr('href');
      if (!href) return;
      href = href.split('#')[0];
      if (!href) return;
      if (!hasNumber(href)) return;
      trade_id = null;
      if (href.indexOf('ershoufang') !== -1) {
        trade_id = Utils.cut(href, 'ershoufang\/', '');
        if (trade_id) trade_id = trade_id.replace('.html', '');
      } else if (href.indexOf('chengjiao') !== -1) {
        trade_id = Utils.cut(href, 'chengjiao\/', '');
        if (trade_id) trade_id = trade_id.replace('.html', '');
      } else if (href.indexOf('xiaoqu') !== -1) {
        var community_id = Utils.cut(href, 'xiaoqu\/', '');
        var num = getNumber(community_id);
        if (!num || num < 10000) return;
        if (!community_id || !community_id.length) return;
        community_id = community_id.replace('.html', '');
        var community_url = getURL(href, distr);
        if (community_url.length < 9) return;
        community_url = community_url.replace('esf\/', '');

        // console.log({
        //   community_id: community_id,
        //   community_url: community_url
        // });
        community_url = community_url.replace('esf/', '');
        var ds = {
          community_id: '' + community_id,
          community_url: community_url
        };
        Models.house_lianjia_community.upsert(ds).then(function(e, d) {});
        return;
      }

      if (trade_id && !trade_ids[trade_id]) {
        trade_ids[trade_id] = true;
        var num = getNumber(trade_id);
        if (!num || num < 10000) return;
        // console.log({
        //   trade_id: trade_id,
        //   trade_url: getURL(href, distr)
        // });
        Models.house_lianjia_detail.upsert({
          trade_id: trade_id,
          trade_url: getURL(href, distr)
        }).then(function() {});
      }
    });
  }

  var cityInfo = require('./city_info');

  module.exports = {
    saveURLSByRecord: recordUrls,
    cityInfo: cityInfo
  };