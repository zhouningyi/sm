
//
const fs = require('fs');
const path = require('path');
const zUtils = require('zcontrol/lib/utils');

const Url = require('./source/url');
const Config = require('./source/config');
const Processor = require('./source/processor');

const pth = path.join(__dirname, './../tasks/from_db');
let pthdir;
function writeFile(code, name) {
  fs.writeFileSync(path.join(pthdir, `${name}.js`), code, 'utf8');
}

function createDir(dirname) {
  pthdir = path.join(pth, dirname);
  if (!fs.existsSync(pthdir)) fs.mkdirSync(pthdir);
}

function execute(config) {
  if (Array.isArray(config)) config = zUtils.toObject(config);
  createDir(`task_${config.name}`);
  const { processor, url } = config;
  delete config.processor;
  delete config.url;
  writeFile(Url.getCode(url), 'url');
  writeFile(Config.getCode(config), 'config');
  writeFile(Processor.getCode(processor), 'processor');
}

const source = [{ id: 'hidden_541611_703797', key: 'version', value: 2, uiType: 'hidden' }, { id: 'input_541611_350789', key: 'name', desc: '唯一名字，不能重复(英文名)', name: '名字', value: 'amap_area', uiType: 'input', valueType: 'string' }, { id: 'input_541611_548165', key: 'name_cn', name: '中文名', value: '中国地区数据信息', uiType: 'input', valueType: 'string' }, { id: 'input_541611_992052', key: 'time', desc: '一次爬取在这个时间后失效，重新执行爬取', name: '更新周期(天)', value: 10, uiType: 'input', validate: { range: { max: 20, min: 0.01 } }, valueType: 'float' }, { id: 'select_541611_761178', key: 'encode', name: '解析编码', value: 'utf8', uiType: 'select', validate: { options: ['utf8', 'gbk'] }, valueType: 'string' }, { id: 'select_541611_594916', key: 'queryType', name: '请求类型', value: 'get', uiType: 'select', validate: { options: ['get', 'post'] }, valueType: 'string' }, { id: 'input_541611_540795', key: 'parallN', desc: '并行爬取进程数', name: '并行数', value: 3, uiType: 'input', valueType: 'integer' }, { id: 'select_541611_578956', key: 'parseType', desc: '数据返回后处理的方式', name: '解析方式', value: 'json', uiType: 'select', validate: { options: ['dom', 'json', 'raw'] }, valueType: 'string' }, { id: 'hidden_541611_448407', key: 'url', desc: '从各种参数生成url', name: 'url', value: "(cb, db_id) => {\n    dblink.upsert(db_id, 'public', 'areas', { adcode: '100000', name: '中国', level: 'country' })\n    .then(() => {\n      dblink.findAll(db_id, 'public', 'areas', { where: { polygon: null } }).then((ds) => {\n        const result = {};\n        _.forEach(ds.data, (d) => {\n          \n          const url = Gaodefy.getUrlDistrict(d.name, d.level);\n          result[url] = { url, params: { name: d.name } };\n        });\n        cb(result);\n      });\n    });\n  };", uiType: 'hidden', valueType: 'string' }, { id: 'hidden_541611_269706', key: 'processor', desc: '结果处理存入表', name: '处理方法', value: "(record, success, fail) => {\n  let { json } = record;\n  const { tables } = record;\n  json = Gaodefy.parseDistrict(json);\n  const ds = _.values(json).map(Utils.cleanObjectNull);\n  Utils.batchUpsert(tables.areas, ds)\n  .then(() => success(null))\n  .catch((e) => {\n    console.log(e);\n    return fail('xx原因');\n  });\n}", uiType: 'hidden', valueType: 'string' }];
execute(source);
