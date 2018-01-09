

// URL 相关的公共方法
// 对seed的解析
function parseSeed(param) {
  if (Array.isArray(param)) return parseSeedArray(param);
  if (typeof (param) === 'function') return parseSeedFunc(param);
  if (typeof (param) === 'object') return parseSeedRange(param);
}

function parseSeedArray(param) {
  const result = [];
  for (let i = 0; i < param.length; i++) {
    result.push(param[i]);
  }
  return result;
}

function parseSeedRange(param) {
  const result = [];
  let min = param.min,
    max = param.max,
    step = param.step || 1;
  for (let i = min; i <= max; i += step) {
    result.push(i);
  }
  return result;
}

function parseSeedFunc(param) {
  return param();
}

//
function joinSeeds(values, key, seeds) { // 把参数逐一组成列表
  let value,
    result = [],
    newParam;
  for (let i = 0; i < values.length; i++) {
    value = values[i];
    if (!seeds.length) {
      newParam = {};
      newParam[key] = value;
      result.push(newParam);
    }
    for (let j = 0; j < seeds.length; j++) {
      newParam = {};
      newParam[key] = value;
      result.push(newParam);
      //
      const seed = seeds[j];
      for (const k in seed) {
        newParam[k] = seed[k];
      }
    }
  }
  return result;
}


module.exports = {
  parseSeed,
  parseSeedArray,
  parseSeedRange,
  parseSeedFunc,
  joinSeeds,
};

