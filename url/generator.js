// 在内存中生成一堆url
const Utils = require('./../utils');
const Events = require('events').EventEmitter;
const _ = require('lodash');

const getT = Utils.getTime;
const getDt = Utils.getDtText;

function check(urls) {
  if (Array.isArray(urls)) return checkOne(urls[0], 0);
  for (const id in urls) {
    checkOne(urls[id], id);
    break;
  }
}

// 随机检查一条record对象 看看有没有问题
let checkOne = (obj, id) => {
  if (!obj) return Utils.war;
  if (!obj.url) return Utils.warnExit('必须有url字段...');
};

class UrlGen extends Events {
  constructor(config, options, sequelize) {
    super();
    this.config = config;
    this.sequelize = sequelize;
    this.options = Utils.deepMerge(UrlGen.options, options);
  }
  run() {
    const { config } = this;
    let urls = config.urls || config.url;
    this.t = getT();
    this.print('开始生成urls...', 'gray');
    if (typeof (urls) === 'function') {
      urls = urls.bind(config);
      urls(this.process.bind(this), this.options.db_id);
    } else {
      this.process(urls);
    }
  }
	// 检查urls是不是有问题 打印出urls的长度
  process(urls) {
    check(urls);
    if (!Array.isArray(urls)) urls = _.values(urls);
    this.print(`生成${urls.length}条任务(内存), ${getDt(this.t)}`, 'gray');
    this.onReady(urls);
  }
  onReady(urls) {
    setTimeout(() => this.emit('urls', { urls }));
  }
  print(text, color) {
    Utils.print(`${this.config.name} || url_gen || ${text}`, color);
  }
}

UrlGen.options = {};

module.exports = UrlGen;
