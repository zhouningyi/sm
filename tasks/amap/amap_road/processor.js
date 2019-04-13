/**
 *处理方法
 */
const Gaodefy = require('./../../../lib/gaodefy');
const geojson = require('./../../../lib/geojson');
const Utils = require('./../../../utils');
const _ = require('lodash');

const md5 = require('md5');

function parseCoords(str) {
  return str.split(';').map(d => d.split(',').map((v) => {
    return parseFloat(v, 10);
  }));
}

module.exports = (record, success, fail) => {
  const { json } = record;
  const { tables } = record;
  if (!json) return fail('no json...');
  const { route } = json;
  if (!route) return fail('no route...');
  const { paths } = route;
  if (!paths || !paths.length) return fail('no paths...');
  let res = {};
  _.forEach(paths, (path) => {
    const { steps } = path;
    _.forEach(steps, (step) => {
      const { toll_road, toll, cities, duration, tmcs } = step;
      const adcode = _.get(cities, '0.adcode');

      let name = toll_road || toll;
      if (!name || !name.length) name = '';
      _.forEach(tmcs, (lineSeg) => {
        let { polyline, distance, lcode } = lineSeg;
        if (!lcode || !lcode.length) lcode = '';
        const coordinates = parseCoords(polyline);
        const geom = geojson.getGeom(coordinates, 'LineString');
        const unique_id = md5(`${distance}_${lcode}_${name}_${polyline}_${adcode}`);
        const line = {
          unique_id,
          name,
          duration: parseFloat(duration, 10),
          distance: parseFloat(distance, 10),
          adcode,
          polyline: geom
        };
        res[unique_id] = line;
      });
    });
  });

  res = _.values(res);

  Utils.batchUpsert(tables.road, res)
  .then(() => success(null))
  .catch((e) => {
    // console.log(e);
    // process.exit();
    return fail('xx原因');
  });
};
