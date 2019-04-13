/**
 * 形成一堆虚拟浏览器
 */
const puppeteer = require('puppeteer');
const superagent = require('superagent');
const request = require('request');
const cp = require('child_process');
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
      if (e) return reject(e);
      // console.log(e, res, 'normalRequest...');
      // process.exit();
      resolve(res);
    });
  });
}

const _keyBy = d => d;
const CHINESE_ENCODINGS = _.keyBy(['gbk', 'gb2312', 'cp936'], _keyBy);
const RESPONSE_TYPES = _.keyBy(['script'], _keyBy);
class Browser extends Event {
  constructor(config, options) {
    super();
    this.config = config;
    let { proxy } = options;
    options = _.cloneDeep(options);
    if (proxy && typeof proxy === 'function') proxy = proxy();
    options.proxy = proxy;
    this.options = Utils.deepMerge(Browser.options, options);
    this.init();
  }
  async init() {
    const { browser } = this.config;
    if (browser) {
      this.chrome = await puppeteer.launch();
      this.page = await this.chrome.newPage();
      const viewport = _.get(browser, 'options.viewport');
      if (viewport) this.page.setViewport(viewport);
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
  async query(o, next) {
    const { browser } = this.options;
    if (browser) {
      return await this.queryBrowser(o, next);
    } else {
      return await this.queryDirect(o, next);
    }
  }
  _initEventsPage(page) {
    const { output = {}, onRequestStart } = this.config.browser;
    const { type, filter } = output;
    const datas = this.datas = {};
    if (type && type in RESPONSE_TYPES) {
      const ds = datas[type] = datas[type] || [];
      page.on('response', async (resp) => {
        const url = resp._url;
        const resourceType = resp._request._resourceType;
        if (resourceType === type) {
          if (filter({ ...resp, url })) {
            const data = await resp.text();
            ds.push(data);
          }
        }
      });
    }
  }
  async queryBrowser(o, next) {
    const { url } = o;
    const { page, config } = this;
    const { browser } = config;
    this._initEventsPage(page, next);
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });
    if (browser.operate) {
      await browser.operate(page);
    }
    // const file = '/Users/zhouningyi/git/hn.pdf';
    // await page.pdf({ path: file, format: 'A4' });
    // cp.execSync(`open ${file}`);
    // process.exit();

    //
    const { datas } = this;
    next(datas);

    // const headers = this.createHeader();
  }
  _getOptions(params) {
    const headers = this.createHeader();
    const { proxy } = this.options;
    const { parseType, encoding, queryType = 'get', queryTimeout = 10 * 1000 } = this.config;
    return {
      proxy,
      timeout: queryTimeout,
      encoding: encoding || parseType === 'image' ? 'binary' : 'utf8',
      headers,
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
  async queryDirect(params, next) {
    const o = this._getOptions(params);
    delete o.headers['x-forwarded-for'];
    let ds;
    if (o.encoding in CHINESE_ENCODINGS) {
      try {
        ds = await cnRequest(o);
      } catch (e) {
        ds = null;
      }
    } else {
      try {
        ds = await normalRequest(o);
      } catch (e) {
        ds = null;
      }
    }
    const data = {
      res: ds
    };
    next(data);
    this.onResponse(data);
    return data;
  }
}
Browser.options = {
};

module.exports = Browser;
