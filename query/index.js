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
const request = require('request');
const process = require('process');
const _ = require('lodash');

const headers = require('./headers');
// 建立一堆虚拟浏览器 包括代理也在这个组件里完成
const Browsers = require('./browsers');
//

class Query extends Event {
  constructor(config, options) {
    super();
    options = this.options = Utils.deepMerge(Query.options, options);
    options.printInterval = config.printInterval || options.printInterval;
    // console.log(options.printInterval, 'printInterval');
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
  query(obj, next) {
    const config = this.config;
    const queryType = config.queryType || 'get';
    const { url } = obj;
    const rInfo = this.browsers.getOne();


    const options = {
      headers: {
       // 'x-forwarded-for': rInfo.ip,
        user_agent: rInfo.userAgent
      },
      'Proxy-Switch-Ip': 'yes', // 阿布云的自动切换ip设置
      proxy: rInfo.proxy,
       // encoding: config.encoding || 'utf-8'
    };

    options.headers = Utils.deepMerge(_.cloneDeep(options.headers), config.headers || {});

    _.forEach(options.headers, (v, k) => {
      if (typeof v === 'function') options.headers[k] = v();
    });


    if (!options.headers['x-forwarded-for']) delete options.headers['x-forwarded-for'];

    options.url = url;
    options.timeout = config.queryTimeout || 10 * 1000;
    if (this.config.parseType === 'image') options.encoding = 'binary';// 如果不写的话 默认是 utf8  会导致存储图片失败
    if (['gbk', 'gb2312', 'cp936'].some(e => e === this.config.encoding)) {
      // use superagent for charset gbk gb2312 cp936
      const superagent = require('superagent');
      const charset = require('superagent-charset');
      charset(superagent);

      if (queryType === 'get') {
        return superagent
          .get(options.url)
          .proxy(options.proxy)
          .charset(this.config.encoding)
          .set(options.headers)
          .end((err, res) => {
            res.body = res.text;
            next(err, res);
          });
      } else {
        throw new Error('When encoding equals gbk/gb2312/cp936, use superagent, but only support get method now.');
      }
    }

    if (queryType === 'get') {
      request.get(options, next);
    } else if (queryType === 'post') {
      const { query } = obj;
      nd.post(url, query, options, next);
    }
    if (this.queryIndex % this.options.printInterval === 0) {
      this.print(`爬取第${this.queryIndex}条URL..`);
      process.send && process.send({ type: 'urls', payload: this.queryIndex });
    }
    this.queryIndex++;
  }
  onReady() {
    setTimeout(() => this.emit('ready'), 0);
  }
  print(text) {
    Utils.print(`${this.config.name} || query || ${text}`, 'yellow');
  }
}

Query.options = {
  printInterval: 50 // 每隔多少条打印一次
};

module.exports = Query;
