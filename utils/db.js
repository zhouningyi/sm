

// const Utils = require('./../../lib/utils');
// const UtilsConfig = require('./config');
const _ = require('lodash');

function _transfer(type, col, value) {
  type = type.split('(')[0];
  if (col === 'updatedAt' || col === 'createdAt') return ' now() ';
  if (!value) return 'null';
  if (type === 'JSON') return `'${JSON.stringify(value)}'::json`;
  if (type === 'JSON[]') {
    if (!value || !value.length) return ' null ';
    return `ARRAY[${(value || []).map(v => `'${JSON.stringify(v)}'::json`)}]`;
  }
  if (type === 'JSONB') return `'${JSON.stringify(value)}'::jsonb`;
  if (type === 'JSONB[]') {
    if (!value || !value.length) return ' null ';
    return `ARRAY[${(value || []).map(v => `'${JSON.stringify(v)}'::jsonb`)}]`;
  }
  if (type === 'VARCHAR') return `'${value}'`;
  if (type === 'GEOMETRY') {
    return `ST_GeomFromGeoJSON('${JSON.stringify(value)}')`;
  }
  if (type === 'DOUBLE PRECISION') {
    return `${value}`;
  }
  return `${value}`;
}

function _getUpdateSQL(cols) {
  return _.filter(cols, col => col !== 'createdAt').map((col) => {
    return `"${col}"=EXCLUDED."${col}"`;
  }).join(',');
}

function genGetSQL(schema = 'public', table, uniqueKey, colsObj) {
  const cols = _.keys(colsObj).filter(col => col !== uniqueKey);
  const isCreatedAt = 'createdAt' in colsObj;
  const isUpdatedAt = 'updatedAt' in colsObj;
  return (d) => {
    d = _.clone(d);
    const uniqueValue = d[uniqueKey];
    const colsFiltered = _.filter(cols, col => col in d);
    if (isCreatedAt) colsFiltered.push('createdAt');
    if (isUpdatedAt) colsFiltered.push('updatedAt');
    //
    const colsStr = `"${colsFiltered.join('","')}"`;
    const values = colsFiltered.map((col) => {
      const value = d[col];
      const type = colsObj[col].type.toString();
      return _transfer(type, col, value);
    });
    const valueStr = values.join(',');
    const updateStr = _getUpdateSQL(cols);
    //
    return `
      INSERT INTO ${schema}.${table}("${uniqueKey}",  ${colsStr})
      VALUES ('${uniqueValue}', ${valueStr})
      ON CONFLICT ("${uniqueKey}")
      DO UPDATE SET ${updateStr};
  `;
  };
}

function batchUpsert(model, ds) {
  const uniqueKey = _.get(_.values(model.uniqueKeys), '0.column');
  const cols = model.rawAttributes;
  const table = model.name;
  const getSQL = genGetSQL('public', table, uniqueKey, cols);
  const sqlLines = _.map(ds, d => getSQL(d)).join('');
  const sql = `
    BEGIN TRANSACTION;
    ${sqlLines}
    COMMIT;
  `;
  return model.sequelize.query(sql);
}

module.exports = { batchUpsert };
