/**
 *处理方法
 */
// const Utils = require('./../../../utils');
const geojson = require('./../../../lib/geojson');
const gaodefy = require('./../../../lib/gaodefy');
const Utils = require('./../../../lib/dblink/utils');

const md5 = require('md5');
const _ = require('lodash');
// const Errors = require('./../../../lib/errors');
// const Models = require('./../../../model');

module.exports = async (record, success, fail) => {
  const { body, models, params } = record;
  if (!body) return fail('无数据');
  const ds = body.split('|').filter(d => d).map(JSON.parse);
  if (ds.length < 2) {
    console.log('无数据....');
    return success();
  }
  const res = [];
  const resTile = [];
  for (let i = 1; i < ds.length; i += 1) {
    const l = ds[i];
    const [info, ...rest] = l;
    const [z, x, y, type] = info.split('-');
    if (type === 'building' && rest.length) {
      _.forEach(rest, (_l) => {
        const polygonRaw = _l[0];
        const floor = _l[3];
        _.forEach(polygonRaw, (_praw) => {
          const ps = gaodefy.decodeTileV5(_praw, 'v5', 17);
          const polygon = [];
          let lngSum = 0;
          let latSum = 0;
          for (let j = 0; j < ps.length; j += 2) {
            const dx = ps[j];
            const dy = ps[j + 1];
            const latlng = gaodefy.processBuildingV5(x, y, z, dx, dy);
            lngSum += latlng[0];
            latSum += latlng[1];
            polygon.push(latlng);
          }
          res.push({
            unique_id: md5(_praw),
            polygon: geojson.getGeom([polygon], 'Polygon'),
            lat: latSum / polygon.length,
            lng: lngSum / polygon.length,
            floor,
            // x: params.x,
            // y: params.y,
            // z: params.z,
          });
          // resTile.
        });
      });
    }
  }


  const tilesMap = {};

  function pushTile(x, y, z) {
    const unique_id = getTileKey(x, y, z);
    if (!tilesMap[unique_id]) {
      tilesMap[unique_id] = { unique_id, x, y, z };
    }
  }
  function getTileKey(x, y, z) {
    return `${x}_${y}_${z}`;
  }
  const depth = 2;
  const moveDepth = 3;
  function expandTile(tile) {
    const { x, y, z, has_building } = tile;
    tilesMap[getTileKey(x, y, z)] = tile;
    if (has_building) {
      for (let i = -depth * moveDepth; i <= depth * moveDepth; i += depth) {
        for (let j = -depth * moveDepth; j <= depth * moveDepth; j += depth) {
          pushTile(x + i, y + j, z);
        }
        // pushTile(x + i * depth, y + i * depth, z);
        // pushTile(x + i * depth, y - i * depth, z);
        // pushTile(x - i * depth, y + i * depth, z);
        // pushTile(x - i * depth, y - i * depth, z);
      }
    } else if (Math.cos(x * y * z) < -0.8) {
      const randomRadius = 1500;
      const randomX = Math.floor(randomRadius * Math.random());
      const randomY = Math.floor(randomRadius * Math.random());
      pushTile(x + randomX, y + randomY, z);
    }
    return _.values(tilesMap);
  }

  const { x, y, z } = params;
  const tileLine = {
    unique_id: getTileKey(x, y, z),
    x,
    y,
    z,
    has_building: !!res.length,
  };
  const tiles = expandTile(tileLine);
  await Utils.batchUpsert(models.amap_building, res);
  await Utils.batchUpsert(models.amap_tile, tiles);
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
