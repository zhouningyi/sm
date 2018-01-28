/**
 *处理方法
 */
const geojson = require('./../../../../lib/geojson');
const projection = require('./../../../../lib/projection');
// const _ = require('lodash');

const getCoords = (ds) => {
  return (ds && ds.length) ? [ds.map((ll) => {
    const lng = parseFloat(ll.pointLon, 10);
    const lat = parseFloat(ll.pointLat, 10);
    const llnew = projection.BD092GCJ(lat, lng);
    return [llnew.lng, llnew.lat];
  })] : null;
};

module.exports = function (record, success, fail) {
  const { json, data, params, url } = record;
  const Models = record.models;
  if (!json) return fail('no json...');
  const { community_id } = params;
  const coords = getCoords(json.main);
  const polygon = geojson.getGeom(coords, 'Polygon');
  Models.house_iwjw_community.upsert({ polygon, community_id });
  success(null);
};
