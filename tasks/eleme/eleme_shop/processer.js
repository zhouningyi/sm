/**
 *处理方法
 */
var geojson = require('./../../../../lib/geojson');
var gaodefy = require('./../../../../lib/gaodefy');
var _ = require('lodash');

module.exports = function (record, success, fail) {
  const {params, json} = record;
  if(!json) return fail();
  const model = record.models.eleme_shop;
  const history = record.models.eleme_shop_history;
   
  function getRange (t){
    return parseFloat(t[0], 10) + parseFloat(t[1], 10) / 60;
  }
  function getTime(tstr){
    let range = tstr.split('/')
    return range.map((t) => {
      return getRange(t.split(':'))
    });
  }

  function getPrice(d){
    const {average_cost, name} = d;
    if(!average_cost) return null
     return parseFloat(average_cost.replace('¥', '').replace('/人', ''), 10)
  }
  let i = 0;
  _.forEach(json, d => {
    const lng = d.longitude;
    const lat = d.latitude;
    if(!d.id) return;
    const shop_id = d.id.toString();
    const delivery_price = d.float_delivery_fee;
    const minimum_order_amount = d.float_minimum_order_amount;
    const avg_price =  getPrice(d);
    const rating = d.rating;
    const recent_order_num = d.recent_order_num;
    const record = {
      shop_id,
      shop_name: d.name,
      avg_price,
      address: d.address,
      description: d.description,
      delivery_price,
      minimum_order_amount,
      lat, lng,
      opening_hours: d.opening_hours.map(getTime),
      phone: d.phone,
      rating,
      rating_count: d.rating_count,
      recent_order_num,
      center: geojson.getGeom([lng, lat], 'Point')
    };
    console.log(record.address, avg_price, '均价');
    model.upsert(record).then(() => {});
    history.upsert({
      unique_id: `${shop_id}_${avg_price || ''}_${rating}_${recent_order_num}`,
      shop_id, avg_price, rating, recent_order_num
    }).then(() => {});
  });

  success();
};
