/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');

// const dblink = require('./../../../lib/dblink');

module.exports = {
    name: 'localbitcoins',
    desc: '比特币信息',
    time: {
        value: 10,
        type: 'interval'
    },
    urls: async (cb, db_id) => {
        // const url = 'https://localbitcoins.com/api/currencies/';

        // const maxId = _.get(data, '0.max') || 10000;
        // const pageSize = 10;
        // const delta = 400;
        // _.range(pages).reverse().forEach((idx) => {
        //     const url = `https://localbitcoins.com/sell-bitcoins-online/.json?page=${page}`;
        //     urls[url] = { url, params: { lastid: idx } };
        // });
        // cb(urls);
        var rs = []
        var result = {}
        for (var i = 0; i < 10; i++) {
            rs.push(i+1);
        }

        // cb(result);

        _.forEach(rs, (r) => {
            result[`https://localbitcoins.com/sell-bitcoins-online/.json?page=${r}`] = { url: `https://localbitcoins.com/sell-bitcoins-online/.json?page=${r}` }
        });
        cb(result);
    },
    parseType: 'json',
    periodInterval: 10,
    models: ['localbitcoins'],
    printInterval: 30,
    //
    parallN: 11,
};
