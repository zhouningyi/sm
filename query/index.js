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
      if (typeof v === 'function') {
        v = v();
        options.headers[k] = v;
      }
    });


    if (!options.headers['x-forwarded-for']) {
      delete options.headers['x-forwarded-for'];
    }

//     options = {
//       headers: {
//         'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
//         'user_agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
//         'Upgrade-Insecure-Requests': 1,
//         'Host': 'wikileaks.org',
//         'Connection': 'keep-alive',
//         'Cache-Control': 'max-age=0',
// 'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
// 'Accept-Encoding':'gzip, deflate, sdch, br',
// 'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6',
//       }
//     }

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
          // .proxy(options.proxy)
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

// function QueryPool() {
//   events.EventEmitter.call(this);
//   this.isLock = false;
//   this.reset();
// }
// util.inherits(QueryPool, events.);

// QueryPool.options = {
//   'poolSize': 50,
//   'queryTimeout': 5000,
//   'queryInterval': 100,
//   'periodInterval': 0
// };

// QueryPool.prototype = util._extend(QueryPool.prototype, {
//   reset: function () {
//     this.queryIndex = 0;
//     this.poolLength = 0;
//     this.isable = 1;
//   },
//   pipeTo: function (urlStream) {
//     this.urlStream = urlStream;
//     this.config = Utils.deepMerge(QueryPool.options, urlStream.config);
//     //
//     this.initEvent();
//   },
//   pipe: function (processor) {
//     processor.pipeTo(this);
//   },
//   initEvent: function () {
//     var self = this;
//     this.urlStream.on('record', function (record) {
//       self.queryIndex++;
//       self.query(record);
//     });
//   },
//   record: function (url, isOk, cb) {
//     this.urlStream.record(url, isOk, cb);
//   },
//   query: function (record) {
//     var config = this.config;
//     var queryType = (config.queryType || 'get').toLowerCase();
//     //
//     var data = record.data, url = data.url, queryData = data.data;
//     // console.log(url, '\n'); ////////////////////////);////////////////////////);////////////////////////

//     var self = this;
//     this.checkIfResume();
//     if (!this.isable) return console.log('query -> url 可能有误...');
//     //
//     headers = config.headers || headers;
//     var headersCopy = JSON.parse(JSON.stringify(headers));
//     var xForwardedFor = headers['x-forwarded-for'];
//     if (typeof(xForwardedFor) === 'function') {
//       xForwardedFor = headersCopy['x-forwarded-for'] =  xForwardedFor();
//     }
//     //
//     var userAgent = headers.userAgent;
//     if (typeof(userAgent) === 'function') {
//       userAgent = headersCopy['user_agent'] =  headersCopy['user-agent'] =
//       headersCopy['User-agent'] =  userAgent();
//     }
//     //
//     var cookie = headers.cookie || headers.Cookie;
//     if (typeof(cookie) === 'function') {
//       userAgent = headersCopy['Cookie'] =  headersCopy['cookie'] = cookie();
//     }

//     var options = {
//       'timeout': config.queryTimeout,
//       'user_agent': userAgent,
//       'headers': headersCopy,
//       'x-forwarded-for': xForwardedFor,
//       'encoding': this.config.encoding
//       // proxy: 'http://localhost:8866'
//     };

//     function handler(e, response, body){
//       //
//       self.poolLength = self.poolLength - 1;
//       // self.checkIfResume();
//       //
//       self.emit('content', {
//         e: e,
//         response: response,
//         body: body,
//         record: record
//       });
//     }

//     // http://sh.lianjia.com/ershoufang/sh1064862.html
//     if (queryType === 'get'){
//       nd.get(url, options, handler);
//     } else if(queryType === 'post'){
//       nd.post(url, queryData, options, handler);
//     } else {
//       console.log(queryType, 'queryType非 get / post 系统无法处理');
//     }

//     this.poolLength = this.poolLength + 1;
//     //
//   },
//   checkIfResume: function () {
//     if (this.poolLength >= this.config.poolSize - 1) {
//       if (this.config.periodInterval) {
//         this.isLock = true;
//         this.urlStream.pause();
//         setTimeout(function () {
//           this.isLock = false;
//           this.poolLength = 0;
//           this.resume();
//         }.bind(this), this.config.periodInterval);
//       }
//       return;
//     };
//     if (!this.isLock) {
//       setTimeout(this.resume.bind(this));
//     }
//   },
//   pause: function() {
//     this.urlStream.pause();
//     this.isable = false;
//   },
//   resume: function () {
//     this.isable = true;
//     var interval = this.config.queryInterval;
//     var resume = this.urlStream.resume.bind(this.urlStream);
//     if (interval) {
//       clearTimeout(this.loopid);
//       return (this.loopid = setTimeout(resume, interval));
//     }
//     return resume();
//   }
// });

module.exports = Query;
