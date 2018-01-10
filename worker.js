/**
* @Author: disoul
* @Date:   2017-04-27T22:39:33+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-26T00:07:05+08:00
*/

const async = require('async');
const Events = require('events').EventEmitter;
const _ = require('lodash');

const Query = require('./query');
const Processor = require('./processor');

const Utils = require('./utils');
const dblink = require('./lib/dblink');

const { dbs } = require('./core');
// 添加所有的db
_.forEach(dbs, db => dblink.addLink(db));

class Worker extends Events {
  constructor(cfg, config, options) {
    super();
    this.options = Utils.deepMerge(Worker.options, options);
    this.config = config;
    this.id = Utils.getRandId();
		// Utils.print(`初始化workder ${this.id}`)
    this.init();
  }
  init() {
    this.reset();
    this.initOutputModels().then(() => {
      console.log('initOutputModels');
      this.initQuery(this.run.bind(this));
      this.initProcessor();
      this.noExit();
    });
  }
  reset() {
    this.isloop = true;
  }
	// 获取所有存放数据的表的model，即把config.model里的model名字 替换成model对象
  _getLinkObject(o, db_id) {
    if (!o) return {};
    if (typeof o === 'object') return Object.assign({}, o, { db_id });
    o = o.split('.');
    const table_schema = o.length > 1 ? o[0] : 'public';
    const table_name = o[o.length - 1];
    return { table_schema, table_name, db_id };
  }
  async initOutputModels() {
    const { config } = this;
    const { tables } = config;
    if (!config.tables) return this.print('config.tables未设置');
    const result = {};
    let model;
    let o;
    for (const i in tables) {
      const table_name = tables[i];
      o = this._getLinkObject(table_name, this.options.db_id);
      model = await dblink.getTableModel(o);
      _.set(result, table_name, model);
      if (!model) Utils.warnExit(`config_${config.name}/config.tables.${table_name}不存在...`);
    }
    result.sequelize = dblink.getLinkById(this.options.db_id);
    this.models = result;
    return result;
  }
  createRecord(obj) {	// 建立一个record对象 在各个组之间传递
    const config = this.config;
    return {
      name: config.name,
      models: this.models,
      tables: this.models,
      params: obj.params,
      url: obj.url,
      unique_id: obj.unique_id,
      query: obj.query
    };
  }
  noExit() {	// 不让程序在暂停的时候自动退出
    setTimeout(() => {}, 10000000);
  }
		// 请求发生器
  initQuery(next) {
    const query = this.query = new Query(this.config);
    query
				.on('ready', this.onReady.bind(this))
				.on('record', this.onRecord.bind(this));
  }
	// 处理器
  initProcessor() {
    this.processor = new Processor(this.config);
  }
  setUrlModel(model) {
    this.urlModel = model;
  }
  onReady() {
    setTimeout((() => this.emit('ready')));
    this.onEmpty();
  }
  run() {
    this.resume();
    setTimeout(this.onEmpty.bind(this));
  }
	// 有新的url
  push(records) {
    this.print('开始执行任务');
    this.urlModel.getCount();
    const jobs = this.jobs = this.createJobs(records);
    const config = this.config;
    const self = this;
    const done = ((e) => {
      console.log('done...............');
      if (e) {
        self.print('出现错误');
        process.exit(); // ////////////////////////////////////////////////////////////注意
      }
      this.onEmpty();
    });

    async.parallelLimit(jobs, this.config.parallN || this.config.poolSize || 1, done);
  }
  createJobs(urls) {
    const jobs = [];
    const self = this;
    _.forEach(urls, (obj, i) => jobs.push(self.createJob(obj, i)));
    this.print(`创建job(行任务)${jobs.length}个`);
    return jobs;
  }
  createJob(obj, i) {
    const { config, query } = this;
    const record = this.createRecord(obj);
    const { url, params } = record;
    const interval = this.config.interval || 0;
    return (next) => {
				// 暂停爬取的情况
      if (!this.isloop) {
        this.curNextFunc = next;
        return;
      }
			// 爬取结束有间隔的情况
      query.query(record, (e, res) => {
        if (e) {
          this.fail(record, 'query response error');
          return setTimeout(() => next(), interval);
        }
        record.res = res;
        this.onRecord(record).then(() => {
          setTimeout(() => next(), interval);
        }).catch((e) => {
          console.log('processor error');
          setTimeout(() => next(), interval);
        });
      });
    };
  }
  onRecord(record) {
    return new Promise((resolve, reject) => {
      this.processor.process(record).then(() => {
        this.success(record);
        resolve();
      }).catch((e) => {
        this.fail(record, e);
        reject(e);
      });
    });
  }
		// 执行成功并写入url数据库
  success(record) {
    this.urlModel.success(record);
  }
		// 执行失败并写入url数据库
  fail(record, e) {
    Utils.warn(`${record.url} 失败... 原因${e}`);
    record.error = e;
    this.urlModel.fail(record);
  }
  onEmpty() {
    console.log('onEmpty\n\n\n');
    setTimeout((() => this.emit('empty')));
  }
  pause(text) {
    this.isloop = false;
    this.print(' ☆ 暂停队列执行...');
  }
  resume() {
    this.isloop = true;
    const func = this.curNextFunc;
    if (!func) return;
    this.print(' ★ 开始队列执行...');
    func();
  }
		// 完成任务后执行的函数
  final() {
    if (this.next) return this.next();
  }
  getStatus() {
    const stQuery = this.query.getStatus();
    const stPorcessor = this.processor.getStatus();
    return {
      queryIndex: stQuery.index,
      processIndex: stPorcessor.index
    };
  }
  print(text) {
    Utils.print(`${this.config.name} || worker || id ${this.id}: ${text}`);
  }
}

Worker.options = {};

module.exports = Worker;
