

const Utils = require('./../lib/utils');
const deepMerge = require('deepmerge');

const warn = str => Utils.warn(str, 'yellow');
const warnExit = Utils.warnExit;

// 检查配置tasks/{taskname}/config.js是否标准
const checkConfig = (cfg) => {
  if (!cfg) warnExit('config不存在');
  if (!cfg.name) warnExit('必须有名字');

  // 错误
  const name = cfg.name;
  const warnHead = `config_${name}: `;
  if (!cfg.urls) warnExit(`${warnHead}必须要有urls函数，从回调函数返回所有url`);
  const qtypes = { get: 1, post: 1 };
  if (!(cfg.queryType.toLowerCase() in qtypes)) warnExit('queryType 只能为get 或post');
  if (!cfg.version) warnExit('请设置config.version');
  const ptypes = { file: 1, image: 1, json: 1, dom: 1 };
  if (!(cfg.parseType.toLowerCase() in ptypes)) warnExit('parseType 错误');
  // 警告
  // if (!cfg.models) warn(`${warnHead}建议配置models, models格式为 [model1, model2..]`);
  if (!cfg.tables) warn(`${warnHead}建议配置tables, tables格式为 [table1, table2..]`);
  if (!cfg.time) warn(`${warnHead}最好有time字段(时间或时间段) 单位为天 是任务需要更新的最小单位`);
  if (cfg.params) warn(`${warnHead}config.arams变量已经弃用`);
  if (cfg.timestamp) warn(`${warnHead}config.timestamp已经弃用 请改config.time`);
  if (cfg.poolSize) warn(`${warnHead}config.poolSize已经启用， 请采用parallN`);
  return cfg;
};

const defaultValidation = [{
  uiType: 'hidden',
  value: 2,
  key: 'version'
}, {
  key: 'name',
  desc: '唯一名字，不能重复(推荐英文名)',
  name: '名字',
  value: '',
  uiType: 'input',
  valueType: 'string'
}, {
  key: 'time',
  desc: '一次爬取在这个时间后失效，重新执行爬取',
  name: '更新周期(天)',
  value: 7,
  uiType: 'slider',
  validate: {
    range: {
      min: 0.01,
      max: 30
    }
  }
}, {
  key: 'encode',
  valueType: 'string',
  uiType: 'select',
  value: 'utf8',
  validate: {
    options: ['utf8']
  }
}];

// 默认的爬虫配置
const defaultConfig = {
  version: 2,
  name: null,
  time() { // 爬取周期 单位天
    return {
      type: 'interval',
      value: 0.01
    };
  },
  urls(a, b, c, d) { // 根据外在的参数生成一堆url
    Utils.warn('url函数未实现');
  },
    // 下载配置
  encode: 'utf8', // 'gbk'
  queryType: 'get',
  queryTimeout: 10 * 1000,
  parallN: 2, // 一次触发几次request
  interval: 100, // 一次触发后，休息多少时间
  timeout: 2000, // request timeout
  headers: {
    userAgentType: 'mobile'
  },
    // data: function(){},
    // 解析
  parseType: 'json', // dom/json 解析的方式
  processing: null,
  printInterval: 50,
  id: (url, param) => url,
  extractN: 500, // 一次性从数据库读取的数据
};

const genConfig = (config) => {
  config = deepMerge(defaultConfig, config, {
    arrayMerge: (target, source) => {
      return source;
    }
  });
  const cf = checkConfig(config);
  return cf;
};

module.exports = {
  checkConfig,
  genConfig
};
