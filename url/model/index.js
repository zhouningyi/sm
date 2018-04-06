/**
* @Author: disoul
* @Date:   2017-04-27T22:39:33+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-17T02:54:05+08:00
*/

// 把一堆url放入model，并初始化

const _ = require('lodash');
const Event = require('events').EventEmitter;
const Utils = require('./../../utils');

const schemaName = 'urls';
const Model = require('./schema');
const async = require('async');

const UtilSQL = require('./sql');

const getT = Utils.getTime;
const getDt = Utils.getDtText;


class UrlModel extends Event {
  constructor(config, options, sequelize) {
    super();
    this.config = config;
    this.sequelize = sequelize;
    this.options = Utils.deepMerge(UrlModel.options, options);
  }
  run() {
    // 先尝试建立schema，然后再建立model
    const ts = [this.createSchema.bind(this), this.createModel.bind(this)];
    async.series(ts, (() => this.emit('ready')));
  }

  close() {
    if (this.sequelize.close) this.sequelize.close(); // 释放连接
  }

	// 建立schema
  createSchema(next) {
    this.sequelize.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`).then(() => {
      this.print('urls schema 已建立', 'gray');
      next();
    });
  }

	// 建立url表
  createModel(next) {
    const modelConf = Model.getModel(this.config.name);
    const t = getT();
    const model = this.model = this.sequelize.define(modelConf.name, modelConf.columns, {});
    model.schema(schemaName).sync().then(() => {
      this.print(`url表已建立, ${getDt(t)}`, 'gray');
      this.prefix(() => next());
    });
  }
  async createIndex(next) {
    const { config } = this;
    const t = getT();
    const sql = UtilSQL.getCreateIndexSQL({
      name: config.name,
      schema: 'urls'
    });
    this.print('开始检查索引...', 'gray');
    try {
      await this.sequelize.query(sql);
    } catch (e) {
      this.print('createIndex 出错');
      console.log(e);
    }
    this.print(`索引已经建立(或已存在), ${getDt(t)}`, 'gray');
    if (next) next();
  }
  prefix(next) {
    const { config } = this;
    const sql = UtilSQL.getStartSQL({
      schema: 'urls',
      ...config
    });
    const t = getT();
    this.sequelize.query(sql).then(() => {
      this.print(`url表已修复lock等情况, ${getDt(t)}`, 'gray');
      next();
    }).catch(e => console.log(e));
  }

  async upsert(urls, cb) {
    const { model, config, options, sequelize } = this;
    const getId = config.id;
    const tasks = [];
    const upsertTransactionN = options.upsertTransactionN;

    const sqldataList = [];
    const o = {
      schema: schemaName,
      table: config.name
    };
    let idx = 0;
    let sqldata;
    let unique_id;
    let dataline;
    urls.forEach((d, i) => {
      idx = Math.floor(i / upsertTransactionN);
      d = urls[i];
      const { url, params, query } = d;
      unique_id = getId(url, params, query);
      sqldata = sqldataList[idx] = sqldataList[idx] || [];
      dataline = Utils.cleanObjectNull({ url, params, unique_id, query });
      sqldata.push(dataline);
    });


    let insertIndex = 0;
    _.forEach(sqldataList, (sqldata) => {
      const func = (next) => {
        const count = insertIndex * upsertTransactionN + sqldata.length;
        this.print(`url表已插入: ${count} 条数据`);
        insertIndex++;
        const sql = UtilSQL.getBigUpsertSQL(o, sqldata);
        sequelize.query(sql).then(() => next()).catch((e) => {
          console.log(e);
          this.print('url 表插入错误...');
        });
      };
      tasks.push(func);
    });
    if (!tasks.length) return Utils.warn(`${config.name}任务 generate后并没有生成URL`);
    //
	  const { upsertParallelLimit } = this.options;
    const t = getT();
    return new Promise((resolve, reject) => {
      async.parallelLimit(tasks, upsertParallelLimit, () => {
        Utils.print(`${config.name} || url_model ||  url表已插入完毕, ${getDt(t)}`, 'gray');
        this.createIndex().then(() => {
          if (cb) cb();
          resolve();
        }).catch(() => {
          if (cb) cb();
          resolve();
        });
      });
    });
  }

  // 找到n个可爬取的url
  extract(n, cb) {
    const { config } = this;
    n = n || config.extractN;
    const sql = UtilSQL.getUrlSQL({
      name: config.name,
      limit: n,
      schema: 'urls',
      ...config
    });
    this.sequelize.query(sql).then(urls => cb(urls));
  }
  async update() {
    const sql = UtilSQL.updateFinishSQL(this.config);
    let ds;
    try {
      ds = await this.sequelize.query(sql);
    } catch (e) {
      this.print('update 出错...');
      console.log(e);
    }
    return ds;
  }
  async drop(next) {
    this.print('开始删除(drop) url存储...', 'gray');
    const sql = UtilSQL.getDropSQL({ name: this.config.name });
    try {
      await this.sequelize.query(sql);
    } catch (e) {
      this.print('drop 出错...', 'gray');
      console.log(e);
    }
    this.print('已经删除(drop) url数据库', 'gray');
    if (next) next();
  }
  // 清空
  async clean(next) {
    this.print('开始清空(delete) url存储...', 'gray');
    const sql = UtilSQL.getCleanSQL({ name: this.config.name });
    try {
      await this.sequelize.query(sql);
    } catch (e) {
      this.print('clean 出错...');
      console.log(e);
    }
    this.print('已经空(delete) url数据库', 'gray');
    if (next) next();
  }
  fail(obj, cb) {
    const { config } = this;
    const sql = UtilSQL.getFailSQL({
      name: config.name,
      unique_id: obj.unique_id,
      error: obj.error,
      isable: obj.isable
    });
    this.sequelize.query(sql).then(ds => (cb && cb(ds)));
  }
  success(obj, cb) {
    const { config, sequelize } = this;
    const sql = UtilSQL.getSuccessSQL({
      name: config.name,
      unique_id: obj.unique_id,
    });
    sequelize.query(sql).then(ds => (cb && cb(ds)));
  }
  async printCount() { // 获取任务总量
    const sql = UtilSQL.getTaskCountSQL(this.config);
    // console.log(sql);
    // process.exit();
    const ds = await this.sequelize.query(sql);
    const count = _.get(ds, '0.0.count');
    this.print(`本次实际任务总量${count}次`);
  }
  print(text, color) {
    Utils.print(`${this.config.name} || url_model || ${text}`, color);
  }
}

UrlModel.options = {// url插入url表的的并发度
  upsertParallelLimit: 5,
  upsertTransactionN: 10000
};

module.exports = UrlModel;
