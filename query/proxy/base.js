/**
 * 寻找合适的代理ip
 */
const Event = require('events').EventEmitter;
const Utils = require('./../utils');


class ProxyBase extends Event {
  constructor(config, options) {
    super();
    options = this.options = Utils.deepMerge(ProxyBase.options, options);
    this.config = config;
    //
    this.index = 0;
  }
  create(cb) {
    this.print('请补全这个函数 create');
  }
  createProxyString() {
    this.print('请补全这个函数 createProxyString');
  }
  getOne() {
    this.print('请补全这个函数 getOne');
  }
  onReady() {
    setTimeout(() => this.emit('ready'));
  }
  print(text) {
    Utils.warn(`proxy ${this.type || ''}: ${text}`);
  }
}

ProxyBase.options = {
};

module.exports = ProxyBase;
