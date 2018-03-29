/**
 * 爬取配置
 */
// const Gaodefy = require('./../../../lib/gaodefy');
const _ = require('lodash');
const dbUtils = require('./../../../lib/dblink/utils');


// const dblink = require('./../../../lib/dblink');

module.exports = {
    name: 'users',
    desc: '比特币外场交易用户信息',
    time: {
        value: 0.01,
        type: 'interval'
    },
    urls: (cb, db_id) => {
        // const order = dbUtils.findAll().toJSON()
        const url = 'https://www.coincola.com/api/v1/contentslist/search';
        const result = {};
        // result[url] = { url };
        // // result[`${url}_`] = { url };
        // cb(result);
        const query = "country_code=CN&currency=&payment_provider=&limit=200&offset=0&sort_order=GENERAL&type=SELL&crypto_currency=LTC&_csrf=ksfp1oBq-ufbgcfCAzfU1YhNZi1HeZoLQDk4"
        result[url] = { url, query };
        cb(result);
    },
    queryType: "post",
    headers: { content_type: "application/x-www-form-urlencoded",
        "x-user-hash": "0c9c248f8cd39e317dadd992ab4e50b7",
        cookie: "__cfduid=d90681908a9a73a094e777078932868881518182337; lang=en-US; _ga=GA1.2.1112399451.1518182350; ad_history_country_code=CN; __zlcmid=kth6qOxFDcV2D8; _gid=GA1.2.292117759.1521474839; coincola_session=s%3A-KnZFjMWevpHLII2U5otWJmH1hgfEne4.Nyeg9bcTqzleVkGWZ1Oj3u8%2BCqstHf6pnn3kTsttizY; _gat=1"
    },
    parseType: 'json',
    periodInterval: 1,
    models: ['coincola_platform'],
    printInterval: 30,
    // proxy: 'shadow',
    //
    parallN: 1,
};
