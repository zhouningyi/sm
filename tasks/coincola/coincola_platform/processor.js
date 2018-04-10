/**
 *处理方法
 */
const Utils = require('./../../../utils');
const dbUtils = require('./../../../lib/dblink/utils');
const _ = require('lodash');
const dblink = require('./../../../lib/dblink');

const lodash = Utils.lodash;

const url = require('url');
const querystring = require('querystring');

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

module.exports = async (record, success, fail) => {
  const { json } = record;
  const { tables } = record;
  if (!json) return fail('没有结果...');
  const results = json.data.advertisements;
  const { otc_user_order, coincola_platform } = record.models;

  const res = results.map((t, index) => {
    const trade_id = t.id;
    delete t.id;
    return {
      ...t,
      trade_id,
      user_id: t.advertiser.id,
      user_info: JSON.stringify(t.advertiser),
      platform: 'coincola',
      unique_id: `${new Date().getTime()}-${index}-${trade_id}`,
            // unique_id: trade_id
    };
  });

  const arg = url.parse(record.url).query;
  const crypto_currency = querystring.parse(arg).crypto_currency;
  trade_ids = res.map(t => t.trade_id);
  const orders = await otc_user_order.findAll({ where: { order_status: true,
    crypto_currency,
    trade_id: {
      $in: trade_ids
    },
  } }).then((t) => {
    return t.map(m => m.toJSON());
  });
  console.log(orders.length);
    //  将response与库中数据对比，找出库中还不存在的新挂单，入库。
  const notExist = lodash.differenceBy(res, orders, 'trade_id');

  const exist = lodash.differenceBy(res, notExist, 'trade_id');
    // 从exist与order中对比，看price是否变化了，

  const same = lodash.differenceWith(
        exist,
        orders,
        (t1, t2) => {
          if (t1.trade_id === t2.trade_id && t1.price !== t2.price) {
            console.log(t1.trade_id, t1.price, '------', t2.trade_id, t2.price);
            return true;
          }
          return false;
        }
    );

  const cbs = lodash.differenceBy(exist, same, 'trade_id');

  await otc_user_order.destroy({ where: { trade_id: cbs.map(t => t.trade_id) } }).then((projects) => {
        // projects 是一个包含 Project 实例的数组，各实例id 是1, 2, 或 3
        // 这在实例执行时，会使用 IN查询
  });

  const totalOrder = cbs.concat(notExist);
  await otc_user_order.bulkCreate(totalOrder).then(t => t);
  await coincola_platform.bulkCreate(totalOrder).then(t => t);
  process.exit();
};
