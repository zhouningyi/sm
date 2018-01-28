/**
 *处理方法
 */
const Utils = require('./../../../../lib/utils');
const _ = require('lodash');

module.exports = (record, success, fail) => {
  const {models, json, params} = record;
  const Flight = models.flight;
  const FlightTrip = models.qunaer_flight_trip;
  const FlightTripBook = models.qunaer_flight_trip_book;

  const result = {};
  if(!json) return fail('json不存在...')
  if (!json.result) return fail('搜索结果不存在...');
  const {ctrlInfo, flightPrices} = json.result;
  const {dep, arr} = ctrlInfo;
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
	  Utils.upsertPg(FlightTrip, flightTripInfo);

	  //订购的信息
	  let flightTripBook = {
	  	trip_id: trip_id,
	  	unique_id: trip_id + '_' + Utils.getTimeStamp() + '_' + params.book_time,
	  	book_time: new Date(params.book_time),
	  	current_time: new Date(),
	  	from_city_name: dep.cityZh,
	  	to_city_name: arr.cityZh,
	  	plane_count: trips.length,
	  	low_price: price.lowPrice,
      low_tax: price.tax,
      duration: journey.duration
	  };
	  Utils.upsertPg(FlightTripBook, flightTripBook);

	  //所有的航班
	  trips.forEach(trip => {
	  	const {flightSegments} = trip;
	  	flightSegments.forEach(fseg => {
	  		let flightInfo = {
	  			flight_id:         fseg.code,

	  			from_airport_id:   fseg.depAirportCode,
	  			from_airport_name: fseg.depAirportName,
	  			from_city_name:    fseg.depCityName,

	  			to_airport_id:     fseg.arrAirportCode,
	  			to_airport_name:   fseg.arrAirportName,
	  			to_city_name:      fseg.arrCityName,

	  			carrier_id:        fseg.carrierCode,
	  			carrier_name_full: fseg.carrierFullName,
	  			carrier_name:      fseg.carrierShortName,

	  			plane_type:        fseg.planeTypeCode,
	  			plane_type_name:   fseg.planeTypeName,

	  			duration:          fseg.duration,
	  			stop_count:        fseg.stops,
	  			is_cross_day:      fseg.crossDays,
	  		};
	  		Flight.upsert(flightInfo).then(()=>null)
	  	})
	  })
  }


  return success(null);
};

