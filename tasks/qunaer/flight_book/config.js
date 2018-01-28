/**
 * 爬取配置
 */
const Utils = require('./../../../../lib/utils');
const Models = require('./../../../../model');

const ds = ['上海', '曼谷'];

const parse = d => (d < 10) ? `0${d}` : d;
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
    tstr = `${time.getFullYear() }-${parse(time.getMonth() + 1) }-${parse(time.getDate())}`;
    ts.push(tstr);
  }
  return ts;
};

const dates = genDates(365);

const genUrl = (from, to, date) => encodeURI(`http://flight.qunar.com/twell/flight/inter/search?depCity=${from}&arrCity=${to}&depDate=${date}&adultNum=1&childNum=0&ex_track=&from=flight_dom_search`);
const genUrls = () => {
  const urls = {};
  let url;
  ds.forEach((from) => {
    ds.filter(to => to !== from).forEach((to) => {
      dates.forEach((date) => {
        url = genUrl(from, to, date);
        const params = {
          book_time: date
        };
        urls[url] = { url, params };
      });
    });
  });
  return urls;
};

module.exports = {
  name: 'flight_book',
  desc: '去哪儿网航班信息',
  timestamp: {
    type: 'interval',
    value: 2
  },
  urls: cb => cb(genUrls()),
  parseType: 'json',
  processing: require('./processor'),
  //
  parralN: 5,
  queryInterval: 1000,
  proxy: 'abu',
  printInterval: 5,
  models: ['flight', 'qunaer_flight_trip', 'qunaer_flight_trip_book']
};
