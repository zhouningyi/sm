/**
 * 爬取配置
 */
const _ = require('lodash');
const dblink = require('./../../../lib/dblink');

const cookie = 'Hm_lvt_3c606e4c5bc6e9ff490f59ae4106beb4=1519652655; _ga=GA1.3.1126601165.1519652655; __els__=1; acw_tc=AQAAAFG9RWW5tgIAUD0sZ+9RBwDMYPC1; _gid=GA1.3.2051103101.1521305009; Hm_lpvt_3c606e4c5bc6e9ff490f59ae4106beb4=1521305018; XSRF-TOKEN=eyJpdiI6IlNRbFNWRkZZVlNVb09IMXV6b3JKNWc9PSIsInZhbHVlIjoiOHlJMzRmc2J2bWJNNnVRNFZlbVNHWktsZkF4ZjFGWGNOeXBtYlBRNWZUb0NlVExBc1RPdHBLMTAwRlBQUER6a2VqNzRIdG1qb1Fvekw1bWZjU2pPcXc9PSIsIm1hYyI6IjA4MDNiOGEzODAwYWMwNTc2MjZiZWU2NWRhM2FhZTM2MjJhNjk3YTA3MjE5YjI5YjAwYzU5OTk1YWM0ZDVkMDYifQ%3D%3D; aicoin_session=eyJpdiI6InhHMVhIU2tsS25uVXhOeG1kY0VaV0E9PSIsInZhbHVlIjoiZmxGSWU0XC9GeDVwZWpJdlNTY2p2QjdPcVpvelUrcHp3dDJkcXRXVjFBb1psOTlPZUI0cFREYUNyMTdjOE5kR09DKzlWdkhjcVlVcnNoNWRKMUYzeHl3PT0iLCJtYWMiOiI0MGMzMWQ0NDNlMjc2Y2VkMDZiOGU1ZGZhMTljOWQ2NjUwMGYyNjU4MTY5ZGI1YWI2ZTNiYmVjYjUzODk4ZTFmIn0%3D';
module.exports = {
  name: 'aicoin_quicknews',
  desc: 'aicoin的信息',
  time: {
    value: 0.01,
    type: 'interval'
  },
  headers: {
    cookie,
    Cookie: cookie,
    Host: 'www.aicoin.net.cn',
    host: 'www.aicoin.net.cn',
    Referer: 'https://www.aicoin.net.cn/',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
  },
  urls: async (cb, db_id) => {
    const urls = {};
    const { data } = await dblink.query(db_id, 'SELECT MAX(LASTID) FROM public.aicoin_quicknews');
    const maxId = _.get(data, '0.max') || 10000;
    const pageSize = 50;
    const delta = 400;
    _.range(maxId, maxId + delta, pageSize).reverse().forEach((idx) => {
      const url = `https://www.aicoin.net.cn/api/data/moreFlash?pagesize=${pageSize}&lastid=${idx}`;
      urls[url] = { url, params: { lastid: idx } };
    });
    cb(urls);
  },
  parseType: 'json',
  periodInterval: 1000,
  // proxy: 'abu',
  models: ['aicoin_quicknews'],
  // tables: ['aicoin_quicknews'],
  printInterval: 30,
  // extractN: 5,
  end: {
    type: 'restart',
    isClean: true,
  },
  //
  parallN: 1,
};
