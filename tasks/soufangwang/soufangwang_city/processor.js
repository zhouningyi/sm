/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');
const $ = require('cheerio').load;
const _ = require('lodash');

module.exports = function (record, success, fail) {
  const Models = record.models;
  const $$ = record.$;
  $$('#c02 a')
    .map((i, node) => {
      const $city = $(node);
      const item = {
        name: $city('a').text(),
        pinyin: /http:\/\/esf.([^.]+).fang.com/i.exec($city('a').attr('href')) && /http:\/\/esf.([^.]+).fang.com/i.exec($city('a').attr('href') || '')[1],
        url: $city('a').attr('href'),
        active: $city('a').attr('class') === 'red',
      };
      result.push(item);
    });
  const sql = Utils.getBigUpsertSQL({ table: 'soufangwang_cities', unique: 'name' }, result);
  console.log(sql);
  Models.sequelize.query(sql).then(() => {
    console.log('ok...');
    process.exit();
  });
};
