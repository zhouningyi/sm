// 行政区划
const _ = require('lodash');

const key = '46799a1920f8b8914ad7d0a2db0096d1'; // 767b3f050b17f8c713e3835b18f57ff9
const Geojson = require('./geojson');
//
function getUrlDistrict(keyword, level) {
  keyword = encodeURI(keyword);
  return `${'http://restapi.amap.com/v3/config/district?subdistrict=1&extensions=all' +
    '&level='}${level}&` + `key=${key
    }&s=rsv3&output=json&keywords=${keyword}`;
    //  +
    // '&platform=JS&logversion=2.0&sdkversion=1.3&' +
    // 'appname=http%3A%2F%2Flbs.amap.com%2Ffn%2Fiframe%2F%3Fid%3D3556';
}

function parseDistrict(body) {
  let district;
  const districts = body.districts;
  const result = {};
  for (const i in districts) {
    district = districts[i];
    //
    const parent = {};
    const adcode = parent.adcode = district.adcode;
    parent.center = parseCenter(district.center);
    parent.lng = _.get(parent, 'center.coordinates.0');
    if (parent.lng) parent.lng = parseFloat(parent.lng, 10);
    parent.lat = _.get(parent, 'center.coordinates.1');
    if (parent.lat) parent.lat = parseFloat(parent.lat, 10);
    if (typeof (district.citycode) === 'string') parent.telecode = district.citycode;
    parent.level = district.level;
    parent.name = district.name;
    parent.polygon = parseLatlngs(district.polyline);
    parent.children = [];

    result[adcode] = parent;
    //

    const children = district.districts;
    children.forEach((child) => {
      if (child.level === 'biz_area' || child.level === 'street') return;
      const childSave = {};
      childSave.center = parseCenter(child.center);
      if (typeof (child.citycode) === 'string') childSave.telecode = child.citycode;
      childSave.level = child.level;
      childSave.name = child.name;
      //
      const adcode = childSave.adcode = child.adcode;
      parent.children.push(_.cloneDeep(childSave));
      childSave.parent = {
        adcode: parent.adcode,
        center: parent.center,
        level: parent.level,
        name: parent.name
      };
      result[adcode] = childSave;
    });
  }
  return result;
}


function parseLatlngs(polyline) {
  if (!polyline || !polyline.length) return;
  polyline = polyline.split('|');
  let latlngs,
    type;
  if (polyline.length > 1) {
    latlngs = [];
    for (const i in polyline) {
      const seg = polyline[i];
      latlngs.push(parseLatlngSegment(seg));
    }
    type = 'MultiPolygon';
  } else {
    type = 'Polygon';
    latlngs = parseLatlngSegment(polyline[0]);
  }
  return Geojson.getGeom([latlngs], type);

  // {
  //   type: 'Feature',
  //   properties: {},
  //   geometry: {
  //     type: type,
  //     coordinates: [latlngs]
  //   }
  // };
}

function parseLatlngSegment(seg) {
  const arr = seg.split(';');
  for (const i in arr) {
    arr[i] = parseLatlng(arr[i]);
  }
  const first = arr[0];
  const last = arr[arr.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) arr.push(first);
  return arr;
}

function parseLatlng(latlng) {
  latlng = latlng.split(',');
  return [parseFloat(latlng[0], 10), parseFloat(latlng[1], 10)];
}

function parseCenter(latlng) {
  latlng = latlng.split(',');
  const lat = parseFloat(latlng[1]);
  const lng = parseFloat(latlng[0]);
  return Geojson.getGeom([lng, lat], 'Point');
}


module.exports = {
  getUrlDistrict,
  parseDistrict
};

