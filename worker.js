
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

const { loadModelConfigs } = require('./model');

const Utils = require('./utils');
const dblink = require('./lib/dblink');

const { dbs, models } = require('./core');
// 添加所有的db
// _.forEach(dbs, db => dblink.addLink(db));

class Worker extends Events {
  constructor(cfg, config, options) {
    super();
    this.options = Utils.deepMerge(Worker.options, options);
    this.config = config;
    this.id = Utils.getRandId();
		// Utils.print(`初始化workder ${this.id}`);
    // this.init();
  }
  async init() {
    const { urls } = this.config;
    const isUrlMode = !!urls;
    this.reset();
    await Promise.all([this.loadModelConfigs(), this.initOutputModels()]);
    if (isUrlMode) {
      this.initQuery();// this.run.bind(this)
    }
    this.initProcessor();
    this.noExit();
  }
  reset() {
    this.isloop = true;
  }
	// 获取所有存放数据的表的model，即把config.model里的model名字 替换成model对象
  _getTableObject(tableO, db_id_default) {
    if (!tableO) return {};
    let table_schema;
    let table_name;
    let db_id;
    if (typeof tableO === 'string') {
      tableO = tableO.split('.');
      table_schema = tableO.length > 1 ? tableO[0] : 'public';
      table_name = tableO[tableO.length - 1];
      db_id = db_id_default;
    } else {
      table_name = tableO.table_name;
      table_schema = tableO.table_schema || 'public';
      db_id = tableO.db_id || 'db_id_default';
    }
    return { table_schema, table_name, db_id };
  }
  async addLink(db_id) {
    const o = _.filter(dbs, d => d.db_id === db_id)[0];
    if (!o) return console.log(`db_id为${db_id}的数据库不存在...`);
    const d = await dblink.addLink(o);
    return d;
  }
  async loadModelConfigs() {
    const cfg = await loadModelConfigs();
    this.modelConfigs = _.keyBy(cfg, d => d.name);
  }
  async initOutputModels() {
    const { config } = this;
    const { tables, models } = config;
    const result = {};
    let model;
    let o;
    const { db_id } = this.options;
    if (db_id) {
      await this.addLink(db_id);
      result.sequelize = await dblink.getLinkById(db_id);
    }
    //
    if (tables) {
      let table_name;
      for (const i in tables) {
        const tableO = tables[i];
        table_name = typeof tableO === 'string' ? tableO : tableO.table_name;
        o = this._getTableObject(tableO, db_id);
        model = await dblink.getTableModel(o);
        _.set(result, table_name, model);
        if (!model) Utils.warnExit(`config_${config.name}/config.tables.${table_name}不存在...`);
      }
    }
    //
    if (models) {
      const { modelConfigs } = this;
      for (const j in models) {
        let modelName = models[j];
        let modelConfig;
        if (typeof modelName === 'string') {
          modelConfig = modelConfigs[modelName];
        } else if (typeof modelName === 'object') {
          modelConfig = modelName;
          modelName = modelConfig.name;
        }
        if (!modelConfig) return console.log(`${modelName}的model不存在`);
        model = await dblink.getTableModel({ db_id: modelConfig.db_id || db_id, model: modelConfig });
        result[modelName] = model;
      }
    }
    this.models = result;
    return result;
  }
  createRecord(obj = {}) {	// 建立一个record对象 在各个组之间传递
    const { config } = this;
    return {
      name: config.name,
      //
      urlModel: this.urlModel,
      models: this.models,
      tables: this.models,
      params: obj.params,
      url: obj.url,
      unique_id: obj.unique_id,
      query: obj.query,
      page: null, // 页面
      json: null, // ajax请求返回
    };
  }
  noExit() { // 不让程序在暂停的时候自动退出
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
  onDone(e) {
    const { config } = this;
    if (e) {
      this.print('出现错误');
      process.exit(); // ////////////////////////////////////////////////////////////注意
    } else if (config.finalize) {
      config.finalize(() => {
        this.onEmpty();
      });
    } else {
      this.onEmpty();
    }
  }
  // run() {
  //   console.log('rum.........');
  //   this.resume();
  //   setTimeout(this.onEmpty.bind(this));
  // }
	// 有新的url
  push(records) {
    this.print('开始执行任务', 'gray');
    const jobs = this.jobs = this.createJobs(records);
    const { config } = this;
    const { parallN, poolSize } = config;
    async.parallelLimit(jobs, parallN || poolSize || 1, this.onDone.bind(this));
  }
  createJobs(urls) {
    const jobs = [];
    _.forEach(urls, (obj, i) => {
      jobs.push(this.createJob(obj, i));
    });
    this.print(`创建job(行任务)${jobs.length}个`);
    return jobs;
  }
  createJob(obj, i) {
    const { config, query } = this;
    const { interval = 0 } = config;
    let record = this.createRecord(obj);
    return (next) => {
      // 暂停爬取的情况
      if (!this.isloop) return (this.curNextFunc = next);
      // 爬取结束有间隔的情况
      query.query(record, (data) => {
        record = { ...record, ...data };
        this.onRecord(record).then(() => {
          setTimeout(() => next(), interval);
        }).catch((e) => {
          console.log('processor error', e);
          setTimeout(() => next(), interval);
        });
      }).catch((e) => {
        console.log('query error', e);
        this.fail(record, 'query response error');
        return setTimeout(() => next(), interval);
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
  startProcess() {
    const record = this.createRecord();
    this.processor.process(record, false);
  }
		// 执行成功并写入url数据库
  success(record) {
    const { urlModel } = this;
    if (urlModel) urlModel.success(record);
  }
		// 执行失败并写入url数据库
  fail(record, e) {
    Utils.warn(`${record.url} 失败... 原因${e}`);
    record.error = e;
    const { urlModel } = this;
    if (urlModel) urlModel.fail(record);
  }
  onEmpty() {
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
  print(text, color) {
    Utils.print(`${this.config.name} || worker || id ${this.id}: ${text}`, color);
  }
}

Worker.options = {};

module.exports = Worker;
