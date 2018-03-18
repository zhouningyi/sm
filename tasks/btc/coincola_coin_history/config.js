/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

// const dblink = require('./../../../lib/dblink');

module.exports = {
    name: 'coincola',
    desc: '比特币信息',
    time: {
        value: 10,
        type: 'interval'
    },
    urls: (cb, db_id) => {
        const url = 'https://www.coincola.com/buy/BTC';
        const result = {};
        result[url] = { url };
        result[`${url}_`] = { url };
        cb(result);
    },
    parseType: 'dom',
    periodInterval: 10,
    tables: ['coincola'],
    printInterval: 30,
    // proxy: 'shadow',
    //
    parallN: 1,
};
