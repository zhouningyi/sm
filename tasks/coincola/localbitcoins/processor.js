/**
 *处理方法
 */
const Utils = require('./../../../utils');

const lodash = Utils.lodash;



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

function _parse(t) {
  return parseFloat(t, 10);
}


module.exports = async (record, success, fail) => {
  const { json } = record;
  const { localbitcoins, localbitcoins_trade } = record.models;
  if (json.data.ad_list.length > 0) {
    const data = json.data.ad_list.map((t, i) => Object.assign({}, t.data,
      {
        profile: t.data.profile,
        platform: 'localbitcoins',
        unique_id: `${new Date().getTime()}-${t.data.ad_id}`,
        created_time: t.data.created_at,
        temp_price_usd: _parse(t.data.temp_price_usd)
      }));
    const url = json.pagination.next;
    if (json.pagination.next) {
      await record.urlModel.upsert([{ url }]);
    } else {
      await record.urlModel.destroy();
      await record.urlModel.upsert([{ url: 'https://localbitcoins.com/sell-bitcoins-online/.json?page=1'}]);
    }


    const trade_ids = data.map(t => t.ad_id);
    const databaseOrders = await localbitcoins_trade.findAll({
      where: {
        ad_id: {
          $in: trade_ids
        },
      }
    }).then((t) => {
      return t.map(m => m.toJSON());
    });

    //  将response与库中数据对比，找出库中还不存在的新挂单，入库。
    const notExist = lodash.differenceBy(data, databaseOrders, 'ad_id');

    const exist = lodash.differenceBy(data, notExist, 'ad_id');
      // 从exist与order中对比，看price是否变化了，

    const same = lodash.differenceWith(
      exist,
      databaseOrders,
      (t1, t2) => {
        if (t1.ad_id === t2.ad_id && t1.temp_price_usd !== t2.temp_price_usd) {
          console.log(t1.ad_id, t1.temp_price_usd, '------', t2.ad_id, t2.temp_price_usd);
          return true;
        }
        return false;
      }
    );

    const cbs = lodash.differenceBy(exist, same, 'ad_id');
    const ad_ids = cbs.map(t => t.ad_id);
    console.log(ad_ids)

    await localbitcoins_trade.destroy({ where: { ad_id: ad_ids  } }).then((projects) => {
          // projects 是一个包含 Project 实例的数组，各实例id 是1, 2, 或 3
          // 这在实例执行时，会使用 IN查询
    });

    const totalOrder = cbs.concat(notExist);
    // await localbitcoins.bulkCreate(totalOrder).then(t => t);
    await Utils.batchUpsert(localbitcoins, totalOrder);
    await Utils.batchUpsert(localbitcoins_trade, totalOrder);
    success();
  }
};
