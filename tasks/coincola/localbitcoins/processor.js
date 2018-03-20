/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');


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
    const { $ } = record;
    const { tables } = record;
    const dom = $('table');
    const results = [];
    console.log(dom)
    //报错，不知道为啥。
    // dom.find('bitcoinlist')[0]
    // dom.find('tbody').find('tr').each((i, d) => {
    //     const tds = $(d).find('td');
    //     const node1 = $(tds[1]);
    //     console.log(node1.text());
    // })

    // dom.find('tbody').find('tr').each((i, d) => {
    //     const tds = $(d).find('td');

    //     // 0
    //     const node0 = $(tds[0]);
    //     const href = $(node0.find('a')[0]).attr('href')
    //     const atmp = node0.find('a')[1];
    //     const sallerDom = node0.find('a')[1];
    //     const saller_name = $(sallerDom).text();
    //     // 1
    //     const node1 = $(tds[1]);
    //     // const nameNode = node1.find('span');
    //     const describe = node1.text();
    //     // const coin_full_name = node1.find('.currency-name-container').text();
    //     // const trend_url = getUrl(nameNode.find('a').attr('href'));

    //     //2

    //     const node2 = $(tds[2])
    //     const pay_type = node2.text();

    //     //3 
    //     const node3 = $(tds[3])
    //     const limits = node3.text();

    //     // 4
    //     const capText = $(tds[3]).text();
    //     const market_cap = getNumber(capText);
    //     // 5
    //     const priceNode = $(tds[4]);
    //     const priceText = priceNode.text();
    //     const price = getNumber(priceText);
    //     const market_url = getUrl(priceNode.find('a').attr('href'));
    //     // 6
    //     // const circulatingNode = $(tds[6]);
    //     // let circulating_supply = circulatingNode.find('a').text();
    //     // circulating_supply = getNumber(circulating_supply);
    //     // 7
    //     // const volumeNode = $(tds[7]);
    //     // const volumeText = volumeNode.text();
    //     // const volumn_24h = getNumber(volumeText);
    //     let data = {
    //         plat: 'coincola',
    //         area: 'global',
    //         userId: getUserId(href),
    //         saller_name,
    //         pay_type,
    //         describe,
    //         limits,
    //         // coin_name,
    //         // coin_full_name,
    //         // trend_url,
    //         market_cap,
    //         market_url,
    //         price,
    //         timestap: new Date().getTime(),
    //     };
    //     data = Utils.cleanObjectNull(data);
    //     results.push(data);
    // });
    // console.log(results);
    // // json = Gaodefy.parseDistrict(json);

    // //需要每次先执行查询，然后本地对比差异，这里有点难用，有空再搞。
    // Utils.batchUpsert(tables.coincola, results)
    //     .then(() => success(null))
    //     .catch((e) => {
    //         console.log(e);
    //         return fail('xx原因');
    //     });
};
