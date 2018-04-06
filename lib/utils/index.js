
const { deepMerge } = require('bcore/utils');
const UtilsDatabase = require('./database');
const UtilsConsole = require('./console');
const UtilsExec = require('./exec');
const UtilsData = require('./data');
const UtilRequest = require('./request');
//
const getObjLength = (obj) => {
  let index = 0;
  for (const k in obj) {
    index++;
  }
  return index;
};

async function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

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
const getDtText = t => `耗时 ${(getTime() - t)} ms...`;

module.exports = {
  ...UtilRequest,
  ...UtilsConsole,
  ...UtilsDatabase,
  ...UtilsExec,
  ...UtilsData,
  deepMerge,
  getObjLength,
  timeStampByDate,
  getRandId,
  //
  getId,
  getTime,
  getDtText,
  getTimeStamp,
  getTimeObject,
  //
  delay,
};
