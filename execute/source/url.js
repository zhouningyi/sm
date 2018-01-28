
function getCode(segments) {
  return `
  const Gaodefy = require('./../../../lib/gaodefy');
  const _ = require('lodash');
  const dblink = require('./../../../lib/dblink');
  //
  module.exports = ${segments};
  `;
}

module.exports = { getCode };
