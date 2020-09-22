

const trade = require('./schema/trade.json');
const Influx = require('influxdb-nodejs');
const _ = require('lodash');

const client = new Influx('http://127.0.0.1:8086/bfs');

const schemaMap = { trade };

function getFieldType(type) {
  if (typeof type === 'object') type = type.type;
  return {
    STRING: 's',
    INTEGER: 'i',
    FLOAT: 'f',
    BOOLEAN: 'b'
  }[type] || 's';
}

function getFieldSchema(fields) {
  const res = {};
  _.forEach(fields, (line) => {
    const { name, column } = line;
    const type = getFieldType(column);
    if (!type) console.log(column, 'getFieldSchema column...');
    res[name] = type;
  });
  return res;
}

function getTagSchema(tags) {
  const res = {};
  _.forEach(tags, (line) => {
    const { name, column } = line;
    res[name] = _.get(column, 'validate.options') || '*';
  });
  return res;
}

class Model {
  constructor(options) {
    this.options = options;
  }
  async batchInsert(ds, o = {}) {
    const { batchN = 10 } = o;
    const { columns, table_name } = this.options;
    const tagKeys = {};
    const filedKeys = {};
    let timeKey = null;
    for (const name in columns) {
      if (columns[name].index) {
        tagKeys[name] = true;
      } else if (isTime(columns[name])) {
        timeKey = name;
      } else {
        filedKeys[name] = true;
      }
    }
    // ds = [ds[0]];
    for (const i in ds) {
      const d = ds[i];
      const tag = {};
      const field = {};
      for (const k in d) {
        if (k in tagKeys) tag[k] = d[k];
        if (k in filedKeys)field[k] = d[k];
      }
      let q = client.write(table_name).tag(tag).field(field);
      if (timeKey) q = q.time(d[timeKey].getTime(), 'ms');
      q = q.queue();
      if (client.writeQueueLength > batchN) await client.syncWrite();
    }
  }
}

function isTime(type) {
  type = typeof type === 'object' ? type.type : type;
  return ['DATE', 'TIME'].includes(type);
}

function getModels(schemaMap) {
  const res = {};
  _.forEach(schemaMap, (sch) => {
    const { name: table_name, columns } = sch;
    const columnList = _.map(columns, (column, name) => ({ name, column }));
    const tagList = _.filter(columnList, col => col.column.index);
    const tagSchema = getTagSchema(tagList);
    const fieldList = _.filter(columnList, col => !col.column.index && !isTime(col.column.type));
    const fieldSchema = getFieldSchema(fieldList);
    client.schema(table_name, fieldSchema, tagSchema, {
      stripUnknown: true,
    });
    res[table_name] = new Model({ table_name, columns });
  });
  return res;
}


module.exports = getModels(schemaMap);
