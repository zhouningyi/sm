/**
* @Author: disoul
* @Date:   2017-04-27T22:39:33+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-26T00:05:46+08:00
*/

const cheerio = require('cheerio');
const Event = require('events').EventEmitter;

// 处理返回的数据
class Processor extends Event {
  constructor(config, options) {
    super();
    this.config = config;
  }
  reset() {
    this.index = 0;
  }
  process(record) {
    return new Promise((resolve, reject) => {
      const res = record.res;
      const config = this.config;
      const parseType = config.parseType;
      const body = record.body = res.body;

      // 做一次变换 坏处是耗费了一些内存
      const failF = e => reject(e || 'processor error');
      const successF = () => resolve();

      if (parseType === 'dom') {
        record.$ = cheerio.load(body);
      } else if (parseType === 'json') {
        if (typeof (body) === 'string') {
          try {
            record.json = JSON.parse(body);
          } catch (e) {
            reject(record, 'json parse error');
          }
        } else {
          record.json = body;
        }
      } else if (parseType === 'file') {
        record.file = body;
      } else if (parseType === 'image') {
        record.file = body;
      }
      //
      config.processing(record, successF, failF);
      this.index++;
    });
  }
  getStatus() {
    return {
      index: this.index
    };
  }
}

Processor.options = {};


module.exports = Processor;
