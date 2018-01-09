/**
 * 形成一堆虚拟浏览器
 */
// const Event = require('events').EventEmitter;
const Utils = require('./../utils');
// const UtilsReq = require('./../utils');
const ProxyBase = require('./base');
const CONFIG = require('./../../core');

const cfg = CONFIG.proxy.shadowJP;
const getProxy = () => {
  return `http://${cfg.host}:${cfg.port}`;
};
class Proxy extends ProxyBase {
  constructor(config, options) {
    super();
    options = this.options = Utils.deepMerge(Proxy.options, options);
    this.config = config;
    //
    this.index = 0;
    this.create();
  }
  create() {
    this.onReady();
  }
  getOne() {
    return getProxy();
  }
}

Proxy.options = {
  requestN: 5000
};

module.exports = Proxy;
