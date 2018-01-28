

function getCode(config) {
  let cfgStr = JSON.stringify(config);
  cfgStr = cfgStr.substring(0, cfgStr.length - 1);
  const str = `
  ${cfgStr},
   url: url,
   processor: processor
  }`;
  return ` const url = require('./url');
  const processor = require('./processor');
  //
  module.exports = ${str};
  `;
}


module.exports = { getCode };
