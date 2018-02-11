/**
* @Author: disoul
* @Date:   2017-05-05T20:31:52+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-17T02:40:49+08:00
*/
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const async = require('async');
const Event = require('bcore/event');
const process = require('process');

const Worker = require('./worker');

const UrlGen = require('./url/generator');
const UrlModel = require('./url/model');
//
const dblink = require('./lib/dblink');

const core = require('./core');
const Utils = require('./utils');

const getT = Utils.getTime;
const getDt = Utils.getDtText;

// 查看是否存在某个task任务
function checkExist(url) {
  const pth = path.join(__dirname, url);
  if (!fs.existsSync(pth)) return Utils.warnExit(`${url}不存在`);
}


const findCorrectPath = (filepath, alltasks) => {
  fs.readdirSync(filepath).forEach((name) => {
    const pth = path.join(filepath, name);
    let stat;
    try {
      stat = fs.statSync(pth);
      if (!stat.isDirectory()) return;
    } catch (e) {
      return;
    }
		//
    try {
      const configPath = path.join(pth, 'config.js');
      stat = fs.statSync(configPath);
      if (alltasks[name]) Utils.warnExit(`tasks | ${name}重复..`);
      alltasks[name] = pth;
    } catch (e) {
      findCorrectPath(pth, alltasks);
    }
  });
};

class Tasks extends Event {
  constructor(name, options, next) {
    super();
    options = this.options = Utils.deepMerge(Tasks.options, options);
    this.name = name;
    this.next = next;
    //
    this.loadModelConfigs();
    this.loadFiles();
    this.load(name);
    this.init();
  }
  loadModelConfigs() {
    dblink.loadModelConfigs(core.models);
  }
  loadFiles() {
    const filepath = path.join(__dirname, './tasks');
    const alltasks = this.alltasks = {};
    findCorrectPath(filepath, alltasks);
  }
	// 根据taskName 查找、检查、扩展config
  load(name) {
    const pth = this.alltasks[name];
    const cur = path.join(__dirname, '');
    const urlConifg = `./${path.relative(cur, path.join(pth, 'config.js'))}`;
    const urlProcessor = `./${path.relative(cur, path.join(pth, 'processor.js'))}`;
    checkExist(urlConifg);
    checkExist(urlProcessor);
    let config = require(urlConifg);
    if (!config.processing) config.processing = require(urlProcessor);
    config = this.config = Utils.genConfig(config);
  }
  init(next) {
    const { options, config } = this;
    const empty = next => next();
    const isClean = options.isNeedCleanModel;
    const isUpdate = isClean || options.isNeedUpdateModel;// 如果清空了 必须update
    const tasks = [
      cb => this.initUrlModel(cb),
      isClean ? cb => this.cleanModel(cb) : empty,
      cb => this.runUrlModel(cb),
      options.loopUpdate ? cb => this.updateUrls(cb) : empty,
      isUpdate ? cb => this.createUrls(cb) : empty,
      !options.onlyUrls ? cb => this.createWorkers(cb) : empty,
    ];
    this.tasks = tasks;
    this.onStart();
    async.series(tasks, () => {
      console.log('async: all task finish', tasks);
      options.onlyUrls && process.send && process.send({ type: 'urls/finish' });
    });
  }
  onStart() {
    this.send('start');
    this.emit('start');
  }
  async addLink(db_id) {
    const o = _.filter(core.dbs, o => o.db_id === db_id)[0];
    const d = await dblink.addLink(o);
    return d;
  }
  // 建立url的model
  initUrlModel(next) {
    const { config } = this;
    const { url_db_id } = this.options;
    this.addLink(url_db_id).then(() => {
      dblink.getLinkById(url_db_id).then((urlLink) => {
        this.urlModel = new UrlModel(config, {}, urlLink);
        this.urlGen = new UrlGen(config, {
          db_id: this.options.db_id
        }, urlLink);

        process.on('SIGINT', () => {
          this.urlModel.close(); // 进程结束前释放连接
          console.log('i receive sigint!');
          process.exit(1);
        });
        process.on('exit', (code, signal) => {
          console.log('i will exit', code, signal, this.name, this.options, this.tasks);
          this.urlModel.close(); // 进程结束前释放连接
        });
        next();
      }).catch((e) => {
        console.log(e);
        Utils.warnExit('url数据库连接出错');
      });
    }).catch((e) => {
      console.log(e);
      Utils.warnExit('url数据库连接出错');
    });


    // this.urlModel.on('ready', () => {
    // });
  }
  // 执行url
  runUrlModel(next) {
    this.urlModel.on('ready', () => next()).run();
  }

  cleanModel(next) { // 清除旧UrlDb的内容
    this.urlModel.clean(next);
  }
  createUrls(next) {	// 生成初始化的url
    const urlModel = this.urlModel;
    this.urlGen.on('urls', (obj) => {	// 开始生成一堆url
      const urls = obj.urls;
      urlModel.upsert(urls, () => {
        next();
      });
    }).run();
  }

  updateUrls(next) {
    console.log('ready to updateurls');
    this.urlModel.update(next);
  }

	// 生成初始化的工作节点 这个部分需要考虑分布式扩展
  createWorkers(next) {
    const { config, urlModel } = this;
    const { db_id } = this.options;
    core.workers.forEach((cfg) => {
      const worker = new Worker(cfg, config, { db_id });
      worker.setUrlModel(urlModel);
      this.initEventsWorker(worker);
    });
    next();
  }
  initEventsWorker(worker) {
    const n = this.config.extractN;
    const self = this;
    worker.on('empty', () => {
      self.print(`尝试提取${n}条爬虫url...`);
      process.send && process.send({ type: 'preextract' });
      const t = getT();
      self.extract(n, (urls) => {
        const urlsN = urls.length;
        if (!urlsN) return self.final();
        self.print(`已经提取${urlsN}条url, 给worker${worker.id}装载${getDt(t)}`);
        const id_urls = urls.map(url => url.unique_id);
        process.send && process.send({ type: 'extract', payload: id_urls });
        worker.push(urls);
      });
    });
  }
  extract(n, cb) {
    this.urlModel.extract(n, urls => cb(urls[0]));
  }
  // 获取当前爬取的状态
  getStatus() {
  }
  // 完成任务后执行的函数
  final() {
  	if (this.next) return this.next();
  	this.print('已经完成爬取...');
    this.send('done');
    setTimeout(() => {
      console.log('process.exit....');
      process.exit();
    }, 100);
    process.send && process.send({ type: 'final' });
  }
  send(text) {
  	console.log(text);
  }
  print(text) {
    const config = this.config;
    Utils.print(`${config.name} || task || ${text}`);
  }
}

Tasks.options = {
  isNeedUpdateModel: false,
  isNeedCleanModel: false
};

module.exports = Tasks;
