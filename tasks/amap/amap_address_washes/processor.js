/**
 *处理方法
 */
// const Utils = require('./../../../utils');
const geojson = require('./../../../lib/geojson');
const gaodefy = require('./../../../lib/gaodefy');
const Utils = require('./../../../lib/dblink/utils');
const { formatLine } = require('./utils');

const md5 = require('md5');
const _ = require('lodash');
const { compose } = require('async');
// const Errors = require('./../../../lib/errors');
// const Models = require('./../../../model');
async function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

function _parse(v) {
  return parseFloat(v, 10);
}

module.exports = async (record, success, fail) => {
  const { body, json, models, params, url } = record;
  const { unique_id } = params;
  if (!body) return fail('无数据');
  if (!body.status === '1') return;
  const { pois, aois, addressComponent, formatted_address } = json.regeocode;
  const { adcode, township: town_name, towncode: town_code } = addressComponent;
  // console.log(JSON.stringify(ds, null, 2));
  // if (ds.length < 2) {
  //   console.log('无数据....');
  //   return success();
  // }
  let res = {};
  let aoi_name;
  let aoi_id;
  let aoi_area;
  _.forEach(aois, (p) => {
    if (!p.id) return null;
    aoi_name = p.name;
    aoi_id = p.id;
    aoi_area = _parse(p.area);
    const l = {
      name: p.name,
      area: aoi_area,
      adcode,
      unique_id: p.id,
      poi_id: p.id,
      type_code: p.type,
      town_name,
      town_code
    };
    if (p.address) l.address = p.address;
    res[p.id] = {
      ...res[p.id],
      ...l
    };
  });
  _.forEach(pois, (p) => {
    if (!p.id) return null;
    const l = {
      name: p.name,
      adcode,
      unique_id: p.id,
      poi_id: p.id,
      type_name: p.type,
      town_name,
      town_code
    };
    if (p.address) l.address = p.address;
    if (p.tel && p.tel.length) l.telephone = p.tel;
    res[p.id] = {
      ...res[p.id],
      ...l
    };
  });
  const curLine = { unique_id, adcode, town_name, town_code };
  if (formatted_address) curLine.formatted_address = formatted_address;
  if (aoi_id) curLine.aoi_id = aoi_id;
  if (aoi_name) curLine.aoi_name = aoi_name;
  if (aoi_area) curLine.aoi_area = aoi_area;
  const line = {
    name: params.name,
    ...res[unique_id],
    ...curLine
  };
  res[unique_id] = formatLine(line);
  res = _.values(res);// ///////////////////////
  // res = [line];
  // console.log(res);
  // console.log(res, 'res...');
  try {
    await Utils.batchUpsert(models.amap_tile_poi, res);
  } catch (e) {
    console.log(e);
    await delay(3000);
  }
  // await delay(500);

  success();
  //   return fail('node data');
  // }

  // const result = record.result = [];
  // ds.forEach((d) => {
  //   let record = {
  //     x: d.x,
  //     y: d.y,
  //     z: d.z,
  //     name: d.name,
  //     floor: d.floor,
  //     lat: d.lat,
  //     lng: d.lng,
  //     mock_id: `${d.x}_${d.y}_${d.z}${d.name}_${d.floor}_${d.lat.toFixed(5)}_${d.lng.toFixed(5)}`
  //   };
  //   //
  //   if (d.polygon) record.polygon = geojson.getGeom(d.polygon, 'Polygon');
  //   if (d.c) record.center = geojson.getGeom(d.c, 'Point');
  //   record = Utils.cleanObjectNull(record);
  //   //
  //   Models.building.upsert(record).then(() => {});
  // });

  // success();
};
