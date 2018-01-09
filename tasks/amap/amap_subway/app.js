var model = require('./models/index.js');
var Sequelize = require('sequelize');
var pg = require('pg');
var needle = require('needle');
var models = new model();
// var _url = ['http://map.amap.com/service/subway?_1468726341559&srhdata=4201_drw_wuhan.json',
//   'http://map.amap.com/service/subway?_1468726367528&srhdata=1100_drw_beijing.json',
//   'http://map.amap.com/service/subway?_1468726387385&srhdata=3100_drw_shanghai.json',
//   'http://map.amap.com/service/subway?_1468726406497&srhdata=4401_drw_guangzhou.json',
//   'http://map.amap.com/service/subway?_1468726448253&srhdata=4403_drw_shenzhen.json',
//   'http://map.amap.com/service/subway?_1468726473964&srhdata=1200_drw_tianjin.json',
//   'http://map.amap.com/service/subway?_1468726498689&srhdata=3201_drw_nanjing.json',
//   'http://map.amap.com/service/subway?_1468726523516&srhdata=8100_drw_xianggang.json',
//   'http://map.amap.com/service/subway?_1468651519945&srhdata=3301_drw_hangzhou.json',
//   'http://map.amap.com/service/subway?_1468749107478&srhdata=5000_drw_chongqing.json',
//   'http://map.amap.com/service/subway?_1468749138881&srhdata=2101_drw_shenyang.json',
//   'http://map.amap.com/service/subway?_1468749157022&srhdata=2102_drw_dalian.json',
//   'http://map.amap.com/service/subway?_1468749173571&srhdata=5101_drw_chengdu.json',
//   'http://map.amap.com/service/subway?_1468749190698&srhdata=2201_drw_changchun.json',
//   'http://map.amap.com/service/subway?_1468749204500&srhdata=3205_drw_suzhou.json',
//   'http://map.amap.com/service/subway?_1468749218586&srhdata=4406_drw_foshan.json',
//   'http://map.amap.com/service/subway?_1468749232906&srhdata=5301_drw_kunming.json',
//   'http://map.amap.com/service/subway?_1468749251645&srhdata=6101_drw_xian.json',
//   'http://map.amap.com/service/subway?_1468749265342&srhdata=4101_drw_zhengzhou.json',
//   'http://map.amap.com/service/subway?_1468749281486&srhdata=4301_drw_changsha.json',
//   'http://map.amap.com/service/subway?_1468749294070&srhdata=3302_drw_ningbo.json',
//   'http://map.amap.com/service/subway?_1468749307549&srhdata=3202_drw_wuxi.json',
//   'http://map.amap.com/service/subway?_1468749319617&srhdata=3702_drw_qingdao.json',
//   'http://map.amap.com/service/subway?_1468749334796&srhdata=3601_drw_nanchang.json',
//   'http://map.amap.com/service/subway?_1468749346512&srhdata=3501_drw_fuzhou.json',
//   'http://map.amap.com/service/subway?_1468749357745&srhdata=4419_drw_dongguan.json',
//   'http://map.amap.com/service/subway?_1468749372085&srhdata=2301_drw_haerbin.json'
// ];

// _url.map(function(url) {
//   needle.get(url, function(err, res) {
//     if (err) console.log('error is ', err);
//     var data = res.body,
//       cityid = data.i,
//       citycomment = data.s,
//       lines = data.l;

//     lines.map(function(line) {
//       var stations = line.st,
//         color = line.cl,
//         lineid = line.ls,
//         linecomment = line.ln,
//         stationid, poiid, station_name_en, station_name_zh, lat, lng, position, pathway;

//       stations.map(function(station) {
//         stationid = station.sid;
//         poiid = station.poiid;
//         station_name_en = station.sp;
//         station_name_zh = station.n;
//         pathway = station.r.split('|');
//         position = string2lnglat(station.sl);
//         lng = position[0];
//         lat = position[1];

//         models.Models.lines_stations.upsert({
//           city_id: cityid + '00',
//           city_comment: citycomment,
//           line_id: lineid,
//           line_comment: linecomment,
//           station_id: stationid,
//           color: color,
//           path: pathway,
//           poi_id: poiid,
//           station_name_en: station_name_en,
//           station_name_zh: station_name_zh,
//           lng: lng,
//           lat: lat
//         })
//       })
//     })
//   })
// })

var _url = ['http://map.amap.com/service/subway?_1468726341559&srhdata=4201_info_wuhan.json',
  'http://map.amap.com/service/subway?_1468726367528&srhdata=1100_info_beijing.json',
  'http://map.amap.com/service/subway?_1468726387385&srhdata=3100_info_shanghai.json',
  'http://map.amap.com/service/subway?_1468726406497&srhdata=4401_info_guangzhou.json',
  'http://map.amap.com/service/subway?_1468726448253&srhdata=4403_info_shenzhen.json',
  'http://map.amap.com/service/subway?_1468726473964&srhdata=1200_info_tianjin.json',
  'http://map.amap.com/service/subway?_1468726498689&srhdata=3201_info_nanjing.json',
  'http://map.amap.com/service/subway?_1468726523516&srhdata=8100_info_xianggang.json',
  'http://map.amap.com/service/subway?_1468651519945&srhdata=3301_info_hangzhou.json',
  'http://map.amap.com/service/subway?_1468749107478&srhdata=5000_info_chongqing.json',
  'http://map.amap.com/service/subway?_1468749138881&srhdata=2101_info_shenyang.json',
  'http://map.amap.com/service/subway?_1468749157022&srhdata=2102_info_dalian.json',
  'http://map.amap.com/service/subway?_1468749173571&srhdata=5101_info_chengdu.json',
  'http://map.amap.com/service/subway?_1468749190698&srhdata=2201_info_changchun.json',
  'http://map.amap.com/service/subway?_1468749204500&srhdata=3205_info_suzhou.json',
  'http://map.amap.com/service/subway?_1468749218586&srhdata=4406_info_foshan.json',
  'http://map.amap.com/service/subway?_1468749232906&srhdata=5301_info_kunming.json',
  'http://map.amap.com/service/subway?_1468749251645&srhdata=6101_info_xian.json',
  'http://map.amap.com/service/subway?_1468749265342&srhdata=4101_info_zhengzhou.json',
  'http://map.amap.com/service/subway?_1468749281486&srhdata=4301_info_changsha.json',
  'http://map.amap.com/service/subway?_1468749294070&srhdata=3302_info_ningbo.json',
  'http://map.amap.com/service/subway?_1468749307549&srhdata=3202_info_wuxi.json',
  'http://map.amap.com/service/subway?_1468749319617&srhdata=3702_info_qingdao.json',
  'http://map.amap.com/service/subway?_1468749334796&srhdata=3601_info_nanchang.json',
  'http://map.amap.com/service/subway?_1468749346512&srhdata=3501_info_fuzhou.json',
  'http://map.amap.com/service/subway?_1468749357745&srhdata=4419_info_dongguan.json',
  'http://map.amap.com/service/subway?_1468749372085&srhdata=2301_info_haerbin.json'
];

_url.map(function(url) {
  needle.get(url, function(err, res) {
    if (err) console.log('error is ', err);
    var data = res.body,
      cityid = data.i,
      citycomment = data.s,
      lines = data.l;

    lines.map(function(line) {
      var stations = line.st,
        color = line.cl,
        lineid = line.ls,
        linecomment = line.ln,
        stationid, poiid, station_name_en, station_name_zh, lat, lng, position, pathway;

      stations.map(function(station) {
        stationid = station.sid;
        poiid = station.poiid;
        station_name_en = station.sp;
        station_name_zh = station.n;
        pathway = station.r.split('|');
        position = string2lnglat(station.sl);
        lng = position[0];
        lat = position[1];

        models.Models.lines_stations.upsert({
          city_id: cityid + '00',
          city_comment: citycomment,
          line_id: lineid,
          line_comment: linecomment,
          station_id: stationid,
          color: color,
          path: pathway,
          poi_id: poiid,
          station_name_en: station_name_en,
          station_name_zh: station_name_zh,
          lng: lng,
          lat: lat
        })
      })
    })
  })
})


function string2lnglat(position) {
  return position.split(',');
}