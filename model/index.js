const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const MODELS_PATH = './models';
const EXTEND_PATH = './extend';

function getFileName(name) {
  return name.split('.json')[0];
}

function _load(name) {
  return require(`${MODELS_PATH}/${name}`);
}

function _loadExtend(name) {
  return require(`${EXTEND_PATH}/${name}`);
}

async function loadModelConfigs() {
  const result = {};
  const models = fs.readdirSync(path.join(__filename, '../', MODELS_PATH));
  _.forEach(models, name => result[getFileName(name)] = _load(name));
  //
  const exds = fs.readdirSync(path.join(__filename, '../', EXTEND_PATH));
  _.forEach(exds, (name) => {
    const o = _loadExtend(name);
    _.forEach(o, (line) => {
      const { source, name: mName, desc, columns = {} } = line;
      if (!source) return console.log('extend model: 没有找到source...');
      const sourceM = result[source];
      if (!sourceM) return console.log(`extend model: 没有找到名为${source}的source...`);
      result[mName] = { name: mName, desc, columns: { ...columns, ...sourceM.columns } };
    });
  });
  return result;
}

module.exports = {
  loadModelConfigs
};
