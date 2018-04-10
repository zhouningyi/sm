/**
 *处理方法
 */
const Utils = require('./../../../utils');
const _ = require('lodash');

const redis = require('redis');

const client = redis.createClient(6379, '127.0.0.1');


function getUrl(relPath) {
    return `https://coinmarketcap.com${relPath}`;
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
    const dom = $('body');
    console.log($("input[name='_csrf']").val())
    const csrf = $("input[name='_csrf']").val()
    client.set('_csrf', csrf)

};
