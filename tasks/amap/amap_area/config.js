/**
 * 爬取配置
 */
const Gaodefy = require('./../../../lib/gaodefy');

const dblink = require('./../../../lib/dblink');

module.exports = {
  name: 'amap_area',
  desc: '中国地区数据信息',
  time: {
    value: 10,
    type: 'interval'
  },
  urls: (cb, db_id) => {
    dblink.fn(db_id, 'public', 'areas', 'upsert', {
      adcode: '100000',
      name: '中国',
      level: 'country'
    }).then(() => {
      dblink.fn(db_id, 'public', 'areas', 'findAll', {
        where: {
          adcode: {
            $like: '3101%'
          },
          level: 'district',
        },
        attributes: {
        }
      }).then((ds) => {
        const result = {};
        ds = ds.data;
        let d;
        let url;
        for (const i in ds) {
          d = ds[i].dataValues;
          if (!d) return;
          const { name, level } = d;
          url = Gaodefy.getUrlDistrict(name, level);
          result[url] = { url, params: { name } };
        }
        cb(result);
      });
    });
  },
  parseType: 'json',
  // processing: require('./processer'),
  periodInterval: 1000,
  tables: ['areas'],
  printInterval: 30,
  //
  parallN: 3,
};
