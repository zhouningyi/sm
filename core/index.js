
const dbs = require('./db.json');
const core = require('./core.json');
const models = require('./model.json');

const Utils = require('./../utils');
const dblink = require('./../lib/dblink');

//
const workers = [
  {
    name: '本地worker',
    host: '127.0.0.1'
  }
];
//
const proxy = {
  abu: {
    usr: 'H1WDT19254PIAX0P',
    pwd: '8843A3391F7682A9',
    host: 'proxy.abuyun.com',
    port: '9010'
  },
  shadowJP: {
    host: '127.0.0.1',
    port: 1087
  }
};

async function onCoreReady() {
  const core_db = core.core_servers[core.current];
  const { db_id } = core_db;
  dblink.addLink(core_db);
  dblink.loadDbConfigs(dbs);
  Utils.print('已连到core数据库... 开始查询表信息', 'green');
  const dbsQuery = dblink.findAll(db_id, 'core', 'dbs');
  const qs = [dbsQuery];
  const [dbs] = Promise.All(qs);
  EXPORTS.dbs = dbs.data;
  return dbs.data;
}

//
const EXPORTS = {
  models, dbs, workers, proxy, onCoreReady
};
//
module.exports = EXPORTS;
