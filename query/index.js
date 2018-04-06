/**
* @Author: eason
* @Date:   2016-11-09T18:37:15+08:00
* @Last modified by:   eason
* @Last modified time: 2016-11-10T01:02:41+08:00
*/


/**
 * 形成请求资源池
 */
const Event = require('events').EventEmitter;
const Utils = require('./../utils');
// 这个解析gbk比较好
const nd = require('needle');
const process = require('process');
const _ = require('lodash');
// 建立一堆虚拟浏览器 包括代理也在这个组件里完成
const Browsers = require('./browsers');
//
class Query extends Event {
  constructor(config, options) {
    super();
    options = this.options = Utils.deepMerge(Query.options, options);
    options.printInterval = config.printInterval || options.printInterval;
    this.config = config;
    this.reset();
    this.initBrowsers();
  }
  reset() {
    this.queryIndex = 0;
  }
  initBrowsers() {
    this.browsers = new Browsers(this.config, {});
    this.browsers.on('ready', this.onReady.bind(this));
  }
  onReady() {
    setTimeout(() => this.emit('ready'), 0);
  }
  async query(record, next) {
    const { params, url } = record;
    const ds = await this.browsers.query(url, params, next);
    if (this.queryIndex % this.options.printInterval === 0) {
      this.print(`爬取第${this.queryIndex}条URL..`);
      process.send && process.send({ type: 'urls', payload: this.queryIndex });
    }
    this.queryIndex++;
    return ds;
  }

  print(text) {
    Utils.print(`${this.config.name} || query || ${text}`, 'yellow');
  }
}

Query.options = {
  printInterval: 50 // 每隔多少条打印一次
};

module.exports = Query;
