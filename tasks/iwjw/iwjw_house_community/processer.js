/**
 *处理方法
 */
const Utils = require('./../../lib/utils');
const geojson = require('./../../lib/geojson');
const projection = require('./../../lib/projection');
const _ = require('lodash');

const getPrice = (d) => {
  if (!d) return null;
  const v = parseFloat(d, 10);
  if (d.indexOf('元') !== -1) return v;
  return 10000 * v;
};

module.exports = function (record, success, fail) {
  const { json, data, params, url } = record;
  const Models = record.models;
  if (!json) return fail('no json...');
  _.forEach(json.data.markList, (d) => {
    const ll = projection.BD092GCJ(d.lat, d.lon);
    let item = {
      community_id: `${d.id}`,
      community_complete_year: d.contract,
      community_name: d.name,
      community_url: null,
      district_adcode: params.district_adcode,
      lat: ll.lat,
      lng: ll.lng,
      avg_sell_price_per_square: getPrice(d.unitPrice),
      g: d.g
    };
    if (ll.lat && ll.lng) item.center = geojson.getGeom([ll.lng, ll.lat], 'Point');
    item = Utils.cleanObjectNull(item);
    Models.house_iwjw_community.upsert(item).then(d => null);
  });
  setTimeout(() => success(null), 10000);
};
