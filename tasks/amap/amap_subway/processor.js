/**
 *处理方法
 */
const Utils   = require('./../../../../lib/utils');
const geojson = require('./../../../../lib/geojson');
const gaodefy = require('./../../../../lib/gaodefy');
const _       = require('lodash');
const Errors  = require('./../../../../lib/errors');
const Models  = require('./../../../../model');

module.exports =  (record, success, fail) => {
  const {json} = record;
  const city_adcode = json.i + '00';
  const linelist = json.l;
  if(!linelist) return console.log('没有线路列表...');
  const ki = 10;
  let i = 0;
  linelist.forEach(line => {
    const line_id = line.ls;
    const line_name = line.ln;
    const line_number = line.kn;
    const color = '#' + line.cl;
    console.log(color);
    let item = {city_adcode, line_id, line_name, line_number, color};
    item = Utils.cleanObjectNull(item);
    Models.amap_subway.upsert(item);
    //
    const sites = line.st;
    if(!sites) return console.log('没有站点列表...');
    sites.forEach(site => {
      i++;
      const ll = site.sl.split(',').map(d => parseFloat(d, 10));
      const lat = ll[1];
      const lng = ll[0];
      const site_name = site.n;
      const site_id = site.sid.toString() + '_' + line_id;
      const amap_id = site.poiid;
      const center = geojson.getGeom([lng, lat], 'Point');
      let siteItem = {lat, lng, center, site_name, amap_id, site_id, line_id};
      siteItem = Utils.cleanObjectNull(siteItem);
      setTimeout(() => Models.amap_subway_site.upsert(siteItem).then(() => null).catch(e => {
        if (e) console.log(e);
      }), i * ki)
    });
  });
  setTimeout(success, 3000);
};