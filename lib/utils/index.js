
const { deepMerge } = require('bcore/utils');
const UtilsDatabase = require('./database');
const UtilsConsole = require('./console');
const UtilsExec = require('./exec');
const UtilsData = require('./data');

//
const getObjLength = (obj) => {
  let index = 0;
  for (const k in obj) {
    index++;
  }
  return index;
};

const timeStampByDate = (t) => {
  return function () {
    const d = new Date();
    const date = d.getDate() + (d.getHours() / 24);
    return `${d.getYear()}_${d.getMonth()}_${parseInt(date / t, 10) * t}`;
  };
};

const getTimeObject = () => {
  const d = new Date();
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds()
  };
};

const getTimeStamp = () => {
  const d = new Date();
  return `${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
};

// 生成随机id
const getId = name => [name, new Date().getTime(), Math.floor(Math.random() * 10000)].join('_');
const getRandId = () => Math.floor(Math.random() * 10000);

// 返回秒数
const getTime = () => new Date().getTime();
const getDtText = t => `耗时 ${Math.floor((getTime() - t) / 100) / 10} s...`;

module.exports = Object.assign({ deepMerge }, UtilsConsole, UtilsDatabase, UtilsExec, UtilsData, {
  getObjLength,
  timeStampByDate,
  getRandId,
  //
  getId,
  getTime,
  getDtText,
  getTimeStamp,
  getTimeObject
});
