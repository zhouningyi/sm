

const lodash = require('lodash');
const Utils = require('./../lib/utils');
const UtilsConfig = require('./config');
const DB = require('./db');

module.exports = Object.assign(Utils, UtilsConfig, DB, { lodash });
