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
async function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

module.exports = async (record, success, fail) => {
  const { body, models, params, url } = record;
  if (!body) return fail('无数据');
  const ds = body.split('|').filter(d => d).map(JSON.parse);
  // console.log(JSON.stringify(ds, null, 2));
  if (ds.length < 2) {
    console.log('无数据....');
    return success();
  }
  const res = [];
  let respoi = [];
  for (let i = 1; i < ds.length; i += 1) {
    const l = ds[i];
    const [info, ...rest] = l;
    const [z, x, y, type] = info.split('-');
    if (type === 'building' && rest.length) {
      _.forEach(rest, (_l) => {
        const polygonRaw = _l[0];
        const floor = _l[3];
        const raw_type_id = _l[6];
        _.forEach(polygonRaw, (_praw) => {
          const ps = gaodefy.decodeTileV5(_praw, 'v5', 18);
          const polygon = [];
          let lngSum = 0;
          let latSum = 0;
          for (let j = 0; j < ps.length; j += 2) {
            const dx = ps[j];
            const dy = ps[j + 1];
            const latlng = gaodefy.processTileV5(x, y, z, dx, dy);
            lngSum += latlng[0];
            latSum += latlng[1];
            polygon.push(latlng);
          }
          res.push({
            unique_id: md5(_praw),
            polygon: geojson.getGeom([polygon], 'Polygon'),
            lat: latSum / polygon.length,
            lng: lngSum / polygon.length,
            raw_type_id,
            floor,
            config: {
              ...params,
              url,
            }
          });
          // resTile.
        });
      });
    } else if (type === 'poilabel') {
      _.forEach(rest, (_l) => {
        const pois = _l[0];
        const raw_type_id = _l[6];
        _.forEach(pois, (poi) => {
          const name = poi[0];
          const pt = gaodefy.decodeTileV5(poi[1], 'v5', 18);
          const latlng = gaodefy.processTileV5(x, y, z, pt[0], pt[1]);
          const poi_id = poi[4];
          const line = {
            unique_id: poi_id,
            poi_id,
            name,
            raw_type_id,
            center: geojson.getGeom(latlng, 'Point'),
            config: {
              ...params,
              url,
            }
          };
          respoi.push(line);
        });
      });
    }
  }

  const tilesMap = {};
  function pushTile(_x, _y, _z) {
    const unique_id = getTileKey(_x, _y, _z);
    if (!tilesMap[unique_id]) {
      tilesMap[unique_id] = { unique_id, x: _x, y: _y, z: _z, count_est: res.length };
    }
  }
  function getTileKey(x, y, z) {
    return `${x}_${y}_${z}`;
  }
  const depth = 2;
  const moveDepth = params.depth + 1;
  function expandTile(tile) {
    const { x, y, z } = tile;
    tilesMap[getTileKey(x, y, z)] = tile;
    for (let i = -depth * moveDepth; i <= depth * moveDepth; i += depth) {
      for (let j = -depth * moveDepth; j <= depth * moveDepth; j += depth) {
        pushTile(x + i, y + j, z);
      }
    }
    for (let i = 0; i < 2; i += 1) {
      const randomRadius = 50;
      const randomX = Math.floor(randomRadius * (Math.random() - 0.5));
      const randomY = Math.floor(randomRadius * (Math.random() - 0.5));
      pushTile(x + randomX, y + randomY, z);
    }
    for (let i = 0; i < 1; i += 1) {
      const randomRadius = 2800;
      const randomX = Math.floor(randomRadius * (Math.random() - 0.5));
      const randomY = Math.floor(randomRadius * (Math.random() - 0.5));
      pushTile(x + randomX, y + randomY, z);
    }
    return _.values(tilesMap);
  }

  const { x, y, z, tiles: ts } = params;
  const tileLine = {
    unique_id: getTileKey(x, y, z),
    has_fetch: true,
    count_est: res.length,
    x,
    y,
    z,
    has_building: !!res.length,
  };
  let tiles = expandTile(tileLine);
  tiles = tiles.concat(_.map(ts, (t) => {
    const { x, y, z } = t;
    return {
      unique_id: getTileKey(x, y, z),
      count_est: res.length,
      has_fetch: true,
      x,
      y,
      z,
    };
  }));
  tiles = _.values(_.keyBy(tiles, 'unique_id'));
  //
  //
  respoi = _.keyBy(respoi, r => r.unique_id);
  respoi = _.values(respoi);
  try {
    await Utils.batchUpsert(models.amap_tile_poi, respoi);
    await Utils.batchUpsert(models.amap_building, res);
    await Utils.batchUpsert(models.amap_tile, tiles);
  } catch (e) {
    console.log(respoi.length, '===>>');
    console.log(e);
    await delay(3000);
  }


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
