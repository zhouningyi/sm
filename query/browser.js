/**
 * 形成一堆虚拟浏览器
 */
const puppeteer = require('puppeteer');
const superagent = require('superagent');
const request = require('request');
//
const charset = require('superagent-charset');

charset(superagent);
//
const _ = require('lodash');
const Event = require('events').EventEmitter;
const Utils = require('./../utils');

function switchValue(f, a, b, c) {
  return typeof f === 'function' ? f(a, b, c) : f;
}


async function cnRequest(o) {
  const methodName = {
    DELETE: 'delete',
    POST: 'post',
    GET: 'get',
    PUT: 'put',
  }[o.method];
  return new Promise((resolve, reject) => {
    superagent[methodName](o.url)
        .proxy(o.proxy)
        .charset(this.config.encoding)
        .set(o.headers)
        .end((err, res) => {
          res.body = res.text;
          resolve(res);
        });
  });
}

async function normalRequest(o) {
  return new Promise((resolve, reject) => {
    request(o, (e, res, body) => {
      resolve(res);
    });
  });
}

const CHINESE_ENCODINGS = _.keyBy(['gbk', 'gb2312', 'cp936'], d => d);

class Browser extends Event {
  constructor(config, options) {
    super();
    this.config = config;
    this.options = Utils.deepMerge(Browser.options, options);
    this.init();
  }
  async init() {
    const { browserType } = this.options;
    if (browserType === 'browser') {
      this.chrome = await puppeteer.launch();
    }
    this.onReady();
  }
  createHeader() {
    const headers = _.cloneDeep(this.options.headers);
    _.forEach(headers, (v, k) => {
      headers[k] = switchValue(v, null);
    });
    return headers;
  }
  async createPages() {
    this.page = await this.chrome.newPage();
  }
  async query(params) {
    const { browserType } = this.options;
    if (browserType === 'browser') {
      return await this.queryBrowser(params);
    } else {
      return await this.queryDirect(params);
    }
  }
  async queryBrowser(params) {
    const headers = this.createHeader();
  }
  _getOptions(params) {
    const { parseType, encoding, queryType = 'get', queryTimeout = 10 * 1000 } = this.config;
    return {
      timeout: queryTimeout,
      encoding: encoding || parseType === 'image' ? 'binary' : 'utf8',
      headers: this.createHeader(),
      method: queryType.toUpperCase(),
      ...(params || {}),
    };
  }
  onReady() {
    setTimeout(() => this.emit('ready'));
  }
  onResponse(ds) {
    this.emit('response', { data: ds });
  }
  async queryDirect(params) {
    const o = this._getOptions(params);
    let ds;
    if (o.encoding in CHINESE_ENCODINGS) {
      ds = await cnRequest(o);
    } else {
      ds = await normalRequest(o);
    }
    this.onResponse(ds);
    return ds;
  }
}
Browser.options = {
};

module.exports = Browser;
