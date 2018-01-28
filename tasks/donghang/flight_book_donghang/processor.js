/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');
const _ = require('lodash');

module.exports = (record, success, fail) => {
  const {models, json} = record;
  const Flights = models.qunaer_flight;
  const FlightTrip = models.qunaer_flight_trip;

  const result = {};
  if(!json) return fail('json不存在...')
  if (!json.result) return fail('搜索结果不存在...');
  const {ctrlInfo} = json.result;
  const {dep, arr} = ctrlInfo;
  const {flightPrices} = json;
  if (!flightPrices) return fail('航班信息不存在...');
  for(let trip_id in flightPrices){
  	let info = flightPrices[trip_id];
  	let {journey, price} = info;
  	let {trips} = journey;
	  let flightTripInfo = {
			trip_id: trip_id,
			from_country_name: dep.countryZh,
			from_country_name_en: dep.countryEn,
			from_city_name: dep.cityZh,
			from_city_name_en: dep.cityEn,
			to_country_name: arr.countryZh,
			to_country_name_en: arr.countryEn,
			to_city_name: arr.cityZh,
			to_city_name_en: arr.cityEn,
	  };
  }
  trips.forEach(flight => {
  	console.log(flight);
  })

  return success(null);
};

