/**
 * 爬取配置
 */
const Utils = require('./../../../lib/utils');
const Models = require('./../../../model');
const gaodefy = require('./../../../lib/gaodefy');

const data = require('./data');
const _ = require('lodash');

const createUrl = (d, adcode = 820000) => {
  // let url = gaodefy.getUrlSearchQuilk(d.name, adcode);
  let url = `https://amap.com/service/poiInfo?query_type=TQUERY&pagesize=20&pagenum=1&city=${adcode}&keywords=${d.name}`;
  url = url.replace(/"/g, '');
  url = url.replace(/'/g, '');
  url = encodeURI(url);
  if (Math.random() < 0.00001) console.log(url);
  return url;
};

module.exports = {
  name: 'amap_search_quilk_news',
  desc: '通过高德搜索补全接口获取大量poi点',
  parallN: 1,
  queryInterval: 150,
  extractN: 5000,
  time: {
    type: 'interval',
    value: 7
  },
  headers: {
    cookie: 'UM_distinctid=1729eb97546377-0c291f9b415571-143e6257-1fa400-1729eb97547d0e; cna=wYCeF904P0UCAXph3BAbNlgB; _uab_collina=159704694661551600435714; _ga=GA1.2.221885416.1597907132; guid=d3b3-e8cc-ca7b-f580; CNZZDATA1255626299=674551734-1596390921-%7C1598368864; x5sec=7b22617365727665723b32223a223761376539383934373837366264633036633563643866626262323533363437434a6a6f6c506f46454d614532657249344d4c526741453d227d; tfstk=cf_lBQ6CpKM1te-cfzT51d37SeAlZRG2e9W5uZAf1ARcHFQVi2iqbMPQmKXlJD1..; l=eBxuNtHeQ9P891LWBO5anurza77TEIRXGsPzaNbMiInca6Z1BFGyTNQ4NrsvvdtjgtCjyExyN2roUReMJBaNw7eCeTRepqwToxJO.; isg=BGlpUew1Et0D9y_Mjxh0TtcbeBPDNl1of9HV-QteL9CP0oXkXYbJOHyElHZkyvWg',
    // cookie: 'UM_distinctid=1729eb97546377-0c291f9b415571-143e6257-1fa400-1729eb97547d0e; cna=wYCeF904P0UCAXph3BAbNlgB; _uab_collina=159704694661551600435714; _ga=GA1.2.221885416.1597907132; guid=5a95-ea9d-16b4-9d9c; CNZZDATA1255626299=674551734-1596390921-%7C1598352656; x5sec=7b22617365727665723b32223a223866346365323562353065393036363461663435383834396361633030386331434b36686c506f46454f576833346d532b3669517977453d227d; l=eBxuNtHeQ9P89ItbBO5anurza77TiLRjkiVzaNbMiIncC6nM0o9w6UKQKAWeHa-RJ8XcGB7B4QgUqYyT6eAg7_F8dTByTp3bBHDWCef..; tfstk=cdZhBiV7wfOfSngglMiQhjqgN4odCK9Z97PQblDNGYu_nEpSd25DVF84zT_isWqJP; isg=BK-vHZYBLGOe8Sn6RXoaAD3ZPsW5VAN2JVNTb8E2wZ4hEPUSiSWkxoCCkgAuX9vu'
  },
  urls(cb) {
    const urls = {};
    _.forEach(data, (d) => {
      const url = createUrl(d);
      urls[url] = { url, params: d };
    });
    cb(urls);
  },
  //
  parseType: 'json',
  processing: require('./processor'),
  //
  save: 'postgres',
  models: ['amap_aomen_washes']
};
