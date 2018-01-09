
const dbs = require('./db.json');
//
const workers = [
  {
    name: '本地worker',
    host: 'localhost'
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
module.exports = {
  dbs, workers, proxy
};
