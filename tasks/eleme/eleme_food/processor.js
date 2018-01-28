/**
 *处理方法
 */
const geojson = require('./../../../../lib/geojson');
const gaodefy = require('./../../../../lib/gaodefy');
const _ = require('lodash');

const utils = require('./../../../utils');

function getRange(t) {
  return parseFloat(t[0], 10) + parseFloat(t[1], 10) / 60;
}
function getTime(tstr) {
  const range = tstr.split('/');
  return range.map((t) => {
    return getRange(t.split(':'));
  });
}

module.exports = function (record, success, fail) {
  const { params, json } = record;
  if (!json) return fail();
  const { eleme_shop, eleme_food_sku, eleme_food_item, eleme_category, eleme_title_tag, eleme_food_sku_history, eleme_map_food_item__tag } = record.models;
  console.log(_.get(json, '0.foods.0.month_sales'), '_.get(json, \'0.foods.0.month_sales\')');
  _.forEach(json, (titleTag) => {
    const { name, description } = titleTag;
    const title_tag_name = name;
    const unique_id = (titleTag.id || '').toString();
    const title_tag_type = titleTag.type;
    const { is_activity } = titleTag;
    const eleme_title_tag_item = { unique_id, name, description, is_activity, title_tag_type };
    eleme_title_tag.upsert(eleme_title_tag_item).then(d => null);
    //
    const { foods } = titleTag;
    const eleme_food_item_items = [];
    _.forEach(foods, (food) => {
      const {
        rating, virtual_food_id, restaurant_id,
        month_sales, rating_count, tips, item_id, name,
        satisfy_count, satisfy_rate, min_purchase, pinyin_name, description, category_id,
      } = food;
      const eleme_food_item_item = {
        rating,
        virtual_food_id,
        shop_id: restaurant_id,
        month_sale_count: month_sales,
        rating_count,
        tips,
        food_item_id: item_id,
        food_item_name: name,
        description,
        satisfy_count,
        satisfy_rate,
        min_purchase,
        pinyin_name,
        category_id: category_id.toString()
      };
      eleme_food_item_items.push(eleme_food_item_item);
      // eleme_food_item.upsert(eleme_food_item_item).then(d => null);
      eleme_map_food_item__tag.upsert({
        unique_id: `${title_tag_name || ''}_${item_id}`,
        title_tag_name,
        food_item_id: item_id
      }).then(d => null);
      //
      const eleme_category_item = {
        category_id: category_id.toString()
      };
      eleme_category.upsert(eleme_category_item).then(d => null);
      //
      const { specfoods } = food;
      _.forEach(specfoods, (specfood) => {
        const { sku_id, recent_rating, stock, promotion_stock, price, original_price,
          virtual_food_id, recent_popularity, packing_fee, specs = [] } = specfood;
        const eleme_food_sku_item = {
          food_item_id: item_id,
          sku_id,
          name: specfood.name,
          recent_rating,
          stock,
          promotion_stock,
          price,
          original_price,
          virtual_food_id,
          category_id,
          shop_id: restaurant_id,
          recent_popularity,
          packing_fee,
          month_sales,
          specs,
          specs_count: specfoods.length || 1
        };
        eleme_food_sku.upsert(eleme_food_sku_item).then(d => null);
        eleme_food_sku_history.upsert({
          unique_id: `${sku_id}_${price || 0}_${original_price || ''}`,
          original_price,
          price,
          sku_id
        }).then(d => null);
      });
    });
    //
    utils.batchUpsert(eleme_food_item, eleme_food_item_items);
  });
  // model.upsert(record).then(() => {});
  success();
};
