const fs = require('fs');
const path = require('path');
const request = require('request');
const { deepMerge } = require('bcore/utils');
const SphericalMercator = require('sphericalmercator');

const _ = require('lodash');

const key = '46799a1920f8b8914ad7d0a2db0096d1'; // 767b3f050b17f8c713e3835b18f57ff9

// geoCoder
function geoCoder(address, d, cb) {
  let url = getUrlGeocoder(address);
  url = encodeURI(url);
  request(url, (e, response, body) => {
    if (!body) return cb(null);
    body = JSON.parse(body);
    d = processGeoCoder(body, d);
    cb(d);
  });
}

function getUrlGeocoder(address) {
  return `http://restapi.amap.com/v3/geocode/geo?address=${address}&key=${key}`;
}

function processGeoCoder(body, d) {
  d = d || {};
  const geocodes = body.geocodes;
  if (geocodes && geocodes.length === 1) {
    const obj = geocodes[0];
    let location = obj.location;
    location = location.split(',');
    const lat = parseFloat(location[1], 10);
    const lng = parseFloat(location[0], 10);
    if (!lat) return;
    if (!lng) return;

    d = JSON.parse(JSON.stringify(d));

    const str = obj.formatted_address;
    if (str[str.length - 1] !== '市') d.name_format_gaode = str;
    d.district = obj.district;
    d.adcode = obj.adcode;
    d.c = {
      lat,
      lng
    };
    return d;
  } else {
    console.log('GeoCoder失败', d);
    return null;
  }
}


// 搜索接口
function getUrlSearch(adcode, name, page) {
  const url = `http://ditu.amap.com/service/poiInfo?query_type=TQUERY&city=${adcode
  }&keywords=${name}&pagesize=${100}&pagenum=${page
  }&key=${key}`;
  return encodeURI(url);
}


function getTelephone(obj) {
  if (!obj.tel) return null;
  return obj.tel.split(';');
}

function processSearch(body) {
  if (!body) return null;
  if (body.status === '6') {
    console.log('可能被高德查封，需要进行页面验证....');
  }
  const ds = body.data.poi_list;
  if (!ds || ds.length === 0) {
    console.log('无结果');
    return null;
  }
  const result = {};
  ds.forEach((d) => {
    let { id, name, typecode, newtype, adcode, address, cityname, bound, latitude, longitude } = d;
    if (longitude) longitude = parseFloat(longitude, 10);
    if (latitude) latitude = parseFloat(latitude, 10);
    let record;
    if (!result[id]) {
      record = result[id] = {};
    } else {
      record = result[id];
    }
    //
    record.id = id;
    record.fullName = name;
    record.typecode = typecode;
    record.newtype = newtype;
    record.adcode = adcode;
    record.address = address;
    record.city = cityname;
    record.telephone = getTelephone(d);
    if (latitude && longitude) record.center = [latitude, longitude];
    if (bound && bound.length) {
      record.latlngs = getBound(bound);
      record.polygon = [record.latlngs];
    }
  }
  );
  return result;
}


const flatten = arr => arr.length === 1 ? arr[0] : arr;

function getBound(bound) {
  bound = bound.split('|').map((b) => {
    return b.split('_').map((ll) => {
      return ll.split(',').map((v) => {
        return parseFloat(v, 10);
      });
    });
  });
  return flatten(bound);
}


function search(d, cb) { // 搜索接口
  const cityInfo = d.adcode ? `&city=${config.adcode}` : '';
  let url = `http://ditu.amap.com/service/poiInfo?query_type=TQUERY${cityInfo}&keywords=${d.name_format_gaode}` || `${d.name}&pagesize=100&pagenum=1&qii=true&cluster_state=5&need_utd=true&utd_sceneid=1000&div=PC1000&addr_poi_merge=true&is_classify=true`;
  url = encodeURI(url);
  request({
    url,
    headers: {}
  }, (e, response, body) => {
    body = JSON.parse(body);
    if (body.status == '6') {
      console.log('可能被高德查封，需要进行页面验证');
      process.exit();
    }
    const data = body.data;
    const list = data[0].list;
    if (list.length > 1) {
      console.log(d.name, '多结果');
      // return cb(null);
    } else if (list.length === 0) {
      console.log('无结果');
      return cb(null);
    }
    const obj = list[0];
    d.address_gaode = obj.address;
    d.id_gaode = obj.id || obj.pguid;
    getBound(d, obj);
    d.entrances_gaode = obj.entrances;
    setTimeout(() => {
      cb(d);
    }, config.timeout);
  });
}


function getUrlRGeoCoder(lat, lng, r) {
  const radiusQ = r ? (`&extensions=all&radius=${r}`) : '';
  return `${'http://restapi.amap.com/v3/geocode/regeo?' +
 'key='}${key}&s=rsv3${radiusQ}&location=${lng},${lat}`;
}

function processRGeoCoder(json) {
  if (typeof (json) === 'string') json = JSON.parse(json);
  const regeocode = json.regeocode;
  if (!regeocode) return;
  const d = regeocode.addressComponent;
  if (!d) return;
  const result = {
    formatted_address: regeocode.formatted_address,
    district: d.district,
    province: d.province,
    adcode: d.adcode
  };
  if (d.township && typeof (d.township) === 'string') {
    result.town_ship = d.township;
    result.town_code = d.towncode;
  }
  if (d.businessAreas) result.business_areas = d.businessAreas;
  return result;
}


function processRGeoCoderPois(json) {
  if (typeof (json) === 'string') json = JSON.parse(json);
  const regeocode = json.regeocode;
  if (!regeocode) return;
  const ds = regeocode.pois;
  let city = regeocode.addressComponent.city;
  if (typeof (city) === 'object') city = regeocode.addressComponent.province;
  if (typeof (city) === 'object') console.log(33, '\n\n');
  if (!ds) return console.log('周边没有poi');
  return ds.map((d) => {
    const latlng = (d.location || '0,0').split(',');
    const lat = latlng[1];
    const lng = latlng[0];
    return {
      city,
      category_cn: d.type,
      telephone: d.tel,
      full_name: d.name,
      lat,
      lng,
      c: [lng, lat],
      address: d.address,
      amap_id: d.id
    };
  });
}

function getUrlSearchQuilk(name, adcode) {
  let url = `http://ditu.amap.com/service/poiTipslite?&words=${name}`;
  if (adcode) {
    url += (`&city=${adcode}`);
  }
  return encodeURI(url);
}

function processSearchQuik(ds) {
  if (!ds || !ds.data.tip_list) return;
  return ds.data.tip_list.map((d) => {
    d = d.tip;
    const lat = parseFloat(d.y, 10);
    const lng = parseFloat(d.x, 10);
    const result = {
      category: d.category,
      district: d.district,
      lat,
      lng,
      c: [lng, lat],
      amap_id: d.poiid,
      full_name: d.name,
      address: d.address,
      adcode: d.adcode
    };
    if (d.ignore_district === '0') result.district = d.district;
    return result;
  });
}


function getUrlBuilding(x, y, z) {
  return `http://vector.amap.com/vector/buildings?tiles=${x},${y}&level=${z}`;
}

function getUrlBuildingV5(x, y, z, depth = 1) {
  const o = {};
  for (let i = -depth; i <= depth; i += 1) {
    for (let j = -depth; j <= depth; j += 1) {
      o[`${x + i}_${y + j}`] = [z, x + i, y + j];
    }
  }
  const vs = _.values(o);
  const qstr = _.map(vs, v => v.join(',')).join(';');
  return `http://vdata.amap.com/tiles?v=3&style=5&rd=1&flds=building&t=${qstr}`;
}


const pSize = 256;
const merc = new SphericalMercator({
  size: pSize
});

//
function getTilesFromLatlngs(ds, z, depth) {
  const result = {};
  let x;
  let y;
  let p;
  ds.forEach((d) => {
    p = merc.px([d.lng, d.lat], z);
    x = Math.floor(p[0] / pSize);
    y = Math.floor(p[1] / pSize);
    result[`${x}_${y}`] = [x, y, z];
  });
  return result;
}

function processBuilding(ds) {
  if (!ds || ds.status === 0) return [];
  const list = ds.list[0];
  if (!list) return list;
  const p = list.index;
  const px = p.x * pSize;
  const py = p.y * pSize;
  let x;
  let y;
  let dx;
  let dy;
  let lat;
  let lng;
  let latlng;
  return list.tile.map((d) => {
    const polygon = [];
    const coords = d.coords;
    for (let i = 0; i < coords.length; i += 2) {
      dx = coords[i];
      dy = coords[i + 1];
      x = px + dx;
      y = py + dy;
      latlng = merc.ll([x, y], p.z);
      polygon.push(latlng);
    }
    let latsum = lngsum = 0;
    polygon.forEach((ll) => {
      lngsum += ll[0];
      latsum += ll[1];
    });
    latsum /= polygon.length;
    lngsum /= polygon.length;
    //
    return {
      x: p.x,
      y: p.y,
      z: p.z,
      c: [lngsum, latsum],
      name: d.name,
      polygon: [polygon],
      floor: d.floor,
      lat: latsum,
      lng: lngsum
    };
  });
  return ds;
}


function _formatDigt(v) {
  return parseFloat(v.toFixed(7), 10);
}
function processBuildingV5(x, y, z, dx, dy) {
  const px = x * pSize;
  const py = y * pSize;
  x = px + dx;
  y = py + dy;
  const ll = merc.ll([x, y], z);
  return [_formatDigt(ll[0]), _formatDigt(ll[1])];
}


const districts = require('./gaodefy.district');

function decodeTileV5(chars, version = 'v5', level = 17) {
  let d = 'ASDFGHJKLQWERTYUIO!sdfghjkleiu3~yr5-P&mq9`%zCN*b=8@^xpVM';
  let e;
  let f;
  if (version < 'v5') {
    e = d.length;
    f = 512;
  } else {
    d = d.substr(0, 27);
    e = 27;
    f = 333;
  }
  let k;
  let m;
  let n;
  const h = [];
  let l = NaN;
  for (let m = 0; m < chars.length; m += 1) {
    const char = chars[m];
    let charIndex = d.indexOf(char);
    if (isNaN(l)) {
      l = charIndex * e;
    } else {
      charIndex = l + charIndex - f;
      if (level === 18 && version > 'v5') charIndex /= 4;
      h.push(charIndex);
      l = NaN;
    }
    k = d.indexOf(k);
  }
  return h;
}

module.exports = deepMerge(districts, {
  getBound,
  search,
  //
  getUrlRGeoCoder,
  processRGeoCoder,
  //
  geoCoder,
  getUrlGeocoder,
  processGeoCoder,
  //
  getUrlSearch,
  processSearch,
  //
  getUrlSearchQuilk,
  processSearchQuik,
  processRGeoCoderPois,
  //
  getUrlBuilding,
  processBuilding,
  getTilesFromLatlngs,
  getUrlBuildingV5,
  processBuildingV5,
  decodeTileV5
});
