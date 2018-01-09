
// ////////////导入postgis//////////////

const crs = {
  type: 'name',
  properties: {
    name: 'urn:ogc:def:crs:EPSG:6.3:4326'
  }
};

function getGeoJson(features) {
  return {
    type: 'FeatureCollection',
    features
  };
}

function getFeature(geometry, properties) {
  const feature = {
    type: 'Feature',
    geometry,
  };
  if (properties) feature.properties = properties;
  return feature;
}

function getGeom(coord, type) {
  if (!coord) return null;
  return {
    type,
    coordinates: coord,
    crs
  };
}

// ////// reduce MultiPolygon //////// //
function reduceMultiPolygon(feature) {
  if (!feature.geometry) return feature;
  if (feature.geometry.type === 'MultiPolygon') return feature;
  const geometry = feature.geometry;
  const coords = geometry.coordinates;
  for (let i = coords.length - 1; i >= 0; i--) {
    const latlngs = coords[i];
    if (latlngs.length <= 5 && coords.length > 1) coords.splice(i, 1);
  }
  return feature;
}

// ////////////导出postgis//////////// //
function getParam(options, key) {
  if (options[key] !== undefined) return options[key];
  console.log(`${key}必须存在`);
  process.exit();
}

function getWhere(where) {
  let value,
    result = '';
  for (const key in where) {
    value = where[key];
    result += (`${key}='${value}' AND`);
  }
  return result.substring(0, result.length - 3);
}

function getCenter(d) {
  const c = d.coordinates;
  return {
    lng: c[0],
    lat: c[1]
  };
}

function fromPostGIS(pg, options, cb) {
  const type = options.type || 'geojson'; // features, normal//

  const table = getParam(options, 'table');
  let polygon = getParam(options, 'polygon');
  let center = options.center;
  const centerSQL = center ? `, ST_AsGeoJSON(${center}) as c ` : ' ';
  const properties = options.properties;
  const propertiesSQL = properties ? `, ${properties.join(',')}` : '';
  const digits = options.digits || 4;
  const toralence = options.toralence || 0.05;
  //
  let where = getParam(options, 'where');
  where = getWhere(where);
  const sql = ` SELECT ST_AsGeoJSON( ST_SimplifyPreserveTopology(${polygon}, ${toralence}), ${digits}) as p ${
             centerSQL}${propertiesSQL
            } FROM ${table} ` +
            ` where ${where}`;
  //
  // console.log('fromPostGIS | ' + sql);
  pg.query(sql).then((ds) => {
    ds = ds[0];
    let d,
      geom,
      feature;
    const features = [];
    for (const i in ds) {
      d = ds[i];
      polygon = d.p = JSON.parse(d.p);
      if (type === 'normal') continue;
      // props
      var props = {};
      if (properties) {
        properties.forEach((prop) => {
          props[prop] = d[prop];
        });
      }
      if (center) {
        center = JSON.parse(d.c);
        props.center = getCenter(center);
      }
      feature = getFeature(polygon, props);
      reduceMultiPolygon(feature);
      features.push(feature);
    }
    //
    if (type === 'feature') {
      cb(features[0]);
    } else if (type === 'features') {
      cb(features);
    } else if (type === 'geojson') {
      cb(getGeoJson(features));
    } else if (type === 'normal') {
      cb(ds);
    }
  });
}

module.exports = {
  getGeom,
  getFeature,
  getGeoJson,
  //
  fromPostGIS
};
