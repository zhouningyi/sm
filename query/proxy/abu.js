/**
 * 形成一堆虚拟浏览器
 */
const Utils = require('./../utils');
const UtilsReq = require('./../utils');
const ProxyBase = require('./base');
const CONFIG = require('./../../core');

const abu = CONFIG.proxy.abu;
const getProxy = () => {
  return `http://${abu.usr}:${abu.pwd}@${abu.host}:${abu.port}`;
};
class Browsers extends ProxyBase {
  constructor(config, options) {
    super();
    options = this.options = Utils.deepMerge(Browsers.options, options);
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

Browsers.options = {
  requestN: 5000
};

module.exports = Browsers;
