/**
* @Author: disoul
* @Date:   2017-05-05T20:31:52+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-17T02:34:29+08:00
*/

const Utils = require('./utils');
// 从命令行中获取参数
const argv = require('optimist').argv;
const Task = require('./task');

// 任务名称
const taskName = argv.n || argv.name;
if (!taskName) Utils.warnExit('请包含任务名: node task -n xxxx');
// 是否要用生成的url更新url model
let isNeedUpdateModel = argv.u || argv.update || false;
if (isNeedUpdateModel === true || isNeedUpdateModel === 'true') isNeedUpdateModel = true;

let isNeedCleanModel = argv.c || argv.clean || false;
if (isNeedCleanModel === true || isNeedCleanModel === 'true') isNeedCleanModel = true;

const onlyUrls = argv.urls || false;

const loopUpdate = argv.loop || false;

const db_id = argv.db_id || argv.d || 'local_spider';
const url_db_id = argv.url_db_id || argv.ud || 'local_spider';

module.exports = new Task(taskName, {
  isNeedUpdateModel,
  isNeedCleanModel,
	// \\//\\//\\//\\
  db_id,
  url_db_id,
  onlyUrls,
  loopUpdate
});
