/**
 * 形成一堆虚拟浏览器
 */

const _ = require('lodash');
const Event = require('events').EventEmitter;
const Utils = require('./../utils');
const UtilsReq = require('./utils');
const getProxy = require('./proxy');
const Browser = require('./browser');

class Browsers extends Event {
  constructor(config, options) {
    super();
    options = this.options = Utils.deepMerge(Browsers.options, options);
    this.config = config;
    //
    this.index = 0;
    this.create();
  }
  async create() {
    const { options, config } = this;
    const { browserType, parallN = 1, headers = {}, proxy } = config;
    const { userAgentType = 'mobile' } = headers;
    let browserN = 0;
    const browsers = this.browsers = [];
    browserN = browserType === 'browser' ? Math.max(parallN, options.browserN) : options.requestN;
    //
    const getUserAgent = UtilsReq.getRandomUA(userAgentType);
    const getIp = UtilsReq.getRandomIP();
    const prxy = getProxy(proxy);
    const genProxy = () => prxy ? prxy.getOne() : null;
    //
    const browserO = {
      browserType,
      headers: {
        UserAgent: getUserAgent,
        userAgent: getUserAgent,
        'Proxy-Switch-Ip': proxy === 'abu' ? 'yes' : null,
        'x-forwarded-for': getIp,
        proxy: genProxy,
        ...headers
      }
    };
    _.range(browserN).forEach(() => {
      const browser = new Browser(config, browserO);
      browsers.push(browser);
    });
    this._initEvents();
  }
  _initEvents() {
    const { browsers } = this;
    let idx = 0;
    _.forEach(browsers, (browser) => {
      browser.on('ready', () => {
        idx++;
        if (idx === browsers.length) this.onReady();
      });
    });
  }
  getOne() {
    const { index, browsers } = this;
    this.index = (index + 1) % browsers.length;
    return browsers[index];
  }
  onReady() {
    setTimeout(() => this.emit('ready'));
  }
  async query(url, params = {}) {
    const browser = this.getOne();
    const ds = await browser.query({
      url,
      ...params
    });
    return ds;
  }
}

Browsers.options = {
  requestN: 500,
  browserN: 10
};

module.exports = Browsers;
