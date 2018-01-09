
var Utils = require('./utils');

module.exports = {
  'userAgent': Utils.getRandomUA,
  'Pragma': 'no-cache',
  'x-forwarded-for': Utils.getRandomIP
};
