const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const MODELS_PATH = './models';

function getFileName(name) {
  return name.split('.json')[0];
}

function _load(name) {
  return require(`${MODELS_PATH}/${name}`);
}

async function loadModelConfigs() {
  const result = {};
  const models = fs.readdirSync(path.join(__filename, '../', MODELS_PATH));
  _.forEach(models, name => result[getFileName(name)] = _load(name));
  return result;
}

module.exports = {
  loadModelConfigs
};
