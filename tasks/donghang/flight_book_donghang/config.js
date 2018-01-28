/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const Models = require('./../../../../model');

const ds = ['上海', '曼谷'];

const parse = d => (d < 10) ? `0${  d}` : d;
const genDates = (n) => {
  const now = new Date().getTime(), 
ts = [];
  const interval = 24 * 3600 * 1000;
  let t, 
time, 
tstr;
  for (let i = 0; i < n; i++) {
    t = now + interval * i;
    time = new Date(t);
    tstr = `${time.getFullYear()  }-${  parse(time.getMonth() + 1)  }-${  parse(time.getDate())}`;
    ts.push(tstr);
  }
  return ts;
};

const dates = genDates(365);

const genUrl = (from, to, date) => {
  const formdata = {
    tripType: 'OW',
    'adtCount': 1,
    chdCount: 0,
    infCount: 0,
    'currency': 'CNY',
    'sortType': 'a',
    'segmentList': [{
      'deptCd': 'PVG',
      'arrCd': 'NAY',
      'deptDt': '2017-03-18',
      'deptCdTxt': '上海',
      'arrCdTxt': '北京',
      'deptCityCode': 'SHA',
      'arrCityCode': 'BJS'
    }],
    sortExec: 'a',
    'page': '0',
    inter: 0
  };
  const url = 'http://www.ceair.com/otabooking/flight-search!doFlightSearch.shtml?rand=0.048166826474566715';
};
const genUrls = () => {
  const urls = {};
  let url;
  ds.forEach((from) => {
    ds.filter(to => to !== from).forEach((to) => {
      dates.forEach((date) => {
        url = genUrl(from, to, date);
        urls[url] = { url };
      });
    });
  });
  return urls;
};

module.exports = {
  name: 'flight_book_donghang',
  desc: '东方航空信息',
  timestamp: {
    type: 'interval',
    value: 2
  },
  urls: cb => cb(genUrls()),
  parseType: 'json',
  processing: require('./processor'),
  //
  parralN: 1,
  queryInterval: 1000,
  proxy: 'abu',
  models: ['flight', 'qunaer_flight_trip', 'qunaer_flight_trip_book']
};
