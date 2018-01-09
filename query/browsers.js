/**
 * 形成一堆虚拟浏览器
 */
const Event = require('events').EventEmitter;
const Utils = require('./../utils');
const UtilsReq = require('./utils');
const getProxy = require('./proxy');

class Browsers extends Event {
  constructor(config, options) {
    super();
    options = this.options = Utils.deepMerge(Browsers.options, options);
    this.config = config;
    //
    this.index = 0;
    this.create();
  }
  create() {
    const config = this.config;
    this.reqs = [];
    if (config.proxy) {
      this.createProxy(config.proxy);
    } else {
      this.createDirect();
    }
  }
  createProxy(proxy) {
    const requestN = this.options.requestN;
    const headers = this.config.headers || {};
    const userAgentType = headers.userAgentType || 'mobile';
    let ip,
      userAgent,
      prxy;
    const reqs = this.reqs;
    if (typeof (proxy) === 'string') {
      proxy = getProxy(proxy);
      proxy.on('ready', () => {
        prxy = proxy.getOne();
        userAgent = UtilsReq.getRandomUA(userAgentType);
        ip = UtilsReq.getRandomIP();
        reqs.push({
          userAgent,
          proxy: prxy
        });
        this.onReady();
      });
    }
  }
  createDirect() {
    const requestN = this.options.requestN;
    const headers = this.config.headers || {};
    const userAgentType = headers.userAgentType || 'mobile';
    const reqs = this.reqs;
    let ip,
      userAgent;
    for (let i = 0; i < requestN; i++) {
      ip = UtilsReq.getRandomIP();
      userAgent = UtilsReq.getRandomUA(userAgentType);
      reqs.push({
        userAgent,
        ip
      });
    }
    //
    this.onReady();
  }
  getOne() {
    this.index = (this.index + 1) % this.reqs.length;
    return this.reqs[this.index];
  }
  onReady() {
    setTimeout(() => this.emit('ready'));
  }
}

Browsers.options = {
  requestN: 5000
};

module.exports = Browsers;
