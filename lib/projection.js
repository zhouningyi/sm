//http://www.thinkgis.cn/topic/560370f200b823b7114ea635 more

var WGS2GCJ = function(lat, lon) {
  //
  // Krasovsky 1940
  //
  // a = 6378245.0, 1/f = 298.3
  // b = a * (1 - f)
  // ee = (a^2 - b^2) / a^2;
  this.a = 6378245.0;
  this.ee = 0.00669342162296594323;
  this.pi = 3.14159265358979323;

  // World Geodetic System ==> Mars Geodetic System
  this.transform = function(wgLat, wgLon) {
    var mgLat, mgLon;

    if (this.outOfChina(wgLat, wgLon)) {
      mgLat = wgLat;
      mgLon = wgLon;
      return [mgLat, mgLon];
    }
    dLat = this.transformLat(wgLon - 105.0, wgLat - 35.0);
    dLon = this.transformLon(wgLon - 105.0, wgLat - 35.0);
    radLat = wgLat / 180.0 * this.pi;
    magic = Math.sin(radLat);
    magic = 1 - this.ee * magic * magic;
    sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi);
    dLon = (dLon * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);
    mgLat = wgLat + dLat;
    mgLon = wgLon + dLon;

    return [mgLat, mgLon];
  }

  this.outOfChina = function(lat, lon) {
    if (lon < 72.004 || lon > 137.8347)
      return true;
    if (lat < 0.8293 || lat > 55.8271)
      return true;
    return false;
  }

  this.transformLat = function(x, y) {
    ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * this.pi) + 40.0 * Math.sin(y / 3.0 * this.pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * this.pi) + 320 * Math.sin(y * this.pi / 30.0)) * 2.0 / 3.0;
    return ret;
  }

  this.transformLon = function(x, y) {
    ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * this.pi) + 20.0 * Math.sin(2.0 * x * this.pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * this.pi) + 40.0 * Math.sin(x / 3.0 * this.pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * this.pi) + 300.0 * Math.sin(x / 30.0 * this.pi)) * 2.0 / 3.0;
    return ret;
  }

  lat = Number(lat);
  lon = Number(lon);
  var z = this.transform(lat, lon);
  return {
    'lat': z[0],
    'lng': z[1]
  };
};

function BD092GCJ(lat, lng) {
  var constp = Math.PI * 3000.0 / 180.0;
  var x = parseFloat(lng) - 0.0065;
  var y = parseFloat(lat) - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * constp);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * constp);
  return {
    'lat': parseFloat((z * Math.sin(theta)).toFixed(5), 10),
    'lng': parseFloat((z * Math.cos(theta)).toFixed(5), 10)
  };
};


var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
function GCJ2BD09(lat, lng) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    return {
    'lat': z * Math.cos(theta) + 0.0065,
    'lng': z * Math.sin(theta) + 0.006
  };
}

module.exports = {
  'WGS2GCJ': WGS2GCJ,
  'BD092GCJ': BD092GCJ,
  'GCJ2BD09': GCJ2BD09
};