/**
 *处理方法
 */
const Utils = require('./../../../utils');
const dbUtils = require('./../../../lib/dblink/utils');
const _ = require('lodash');

// const rd = require('./readMsg');

// for (var i = 0; i < 10; i++) {
//     pub("z", i, "" + i);//发布10次
//     console.log("第" + i + "次");
// }

function getUrl(relPath) {
    return `https://coinmarketcap.com${relPath}`;
}

function getUserId(str) {
    if (!str) return null;
    return str.replace(/\/user\//, '');
}

function getNumber(str) {
    if (!str) return null;
    let price = str.replace(/,/g, '');
    price = price.replace(/\$/g, '');
    return parseFloat(price, 10);
}

module.exports = (record, success, fail) => {
    let { json } = record;
    const { tables } = record;
    if (!json) return fail('没有结果...');
    const results = json.data.advertisements;
    const res = results.map((t, index) => {
        const uid = t.id;
        delete t.id;
        return {
            ...t,
            uid,
            unique_id: new Date().getTime() + index,
            unique_id: t.advertiser.id
        }
    })
    
    dbUtils.batchUpsert(tables.coincola_platform, res)
        .then((data) => {
            console.log(data)
            success(null);
        })
        .catch((e) => {
            return fail('xx原因');
        });
};
