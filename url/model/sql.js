/**
* @Author: disoul
* @Date:   2017-04-27T22:39:33+08:00
* @Last modified by:   disoul
* @Last modified time: 2017-05-17T03:37:53+08:00
*/

const Utils = require('./../../lib/utils/database');

const defaultOptions = {
  limit: 200, // 选url一次的条数
  interval: 1,
  retryMax: 2,
  schema: 'urls'
};

const check = (options) => {
  if (options) {
    const table = options.table || options.name;
    if (table) {
      options.tbName = Utils.pluralize(table);
      return Object.assign(defaultOptions, options);
    }
  }
  console.log('缺少任务名... ', options);
  process.exit();
};

function _getDayTime(config) {
  let { time } = config;
  if (typeof (time) === 'function') time = time();
  if (typeof (time) === 'number') return time;
  if (time.type === 'interval') return time.value;
  return Utils.warnExit(`${config.name}_time 的设置有错误`);
}

// 重启的时候，让所有需要执行的retry次数设为0, 并把锁解掉
const getStartSQL = (options) => {
  const o = check(options);
  const day = _getDayTime(o);
  return `
    BEGIN;

    UPDATE ${o.schema}.${o.tbName}
    SET lock = false
    WHERE lock = true;

    UPDATE ${o.schema}.${o.tbName}
    SET retry = 0
    WHERE retry != 0
    AND now() - "updatedAt" > INTERVAL '${day} DAY';

    COMMIT;
  `;
};

const getTaskCountSQL = (options) => {
  const o = check(options);
  return `
    SELECT count(1)
    FROM ${o.schema}.${o.tbName}
    ${_getWhere(o)}
  `;
};

const _getWhere = (options) => {
  const o = check(options);
  const day = _getDayTime(o);
  return `
    WHERE isable = true AND placeholder is NULL
    AND (
      now() - "updatedAt" > INTERVAL '${day} DAY'
      OR (
       retry < ${o.retryMax}
       AND (
         now() - last_update > INTERVAL '${day} DAY'
         OR last_update is null
       )
      )
    )
  `;
};

function updateFinishSQL(options) {
  const o = check(options);
  const now = Date.now().toString();
  const sql = `
    BEGIN;

    UPDATE ${o.schema}.${o.tbName}
    set "updatedAt" = now() - interval '40 years', last_update = NULL, placeholder = NULL
    WHERE unique_id in (
      SELECT unique_id FROM ${o.schema}.${o.tbName} WHERE placeholder = 0 OR ( placeholder is not null AND retry > 0) OR ( placeholder < ${now} - 1200000 ) FOR UPDATE
    );

    COMMIT;
  `;
  return sql;
}

const getUrlSQL = (options) => {
  const o = check(options);
  // where条件
  const content = _getWhere(o);
  const timestamp = Date.now().toString();
  const sql = `
    BEGIN;

    UPDATE ${o.schema}.${o.tbName}
    set lock = true, placeholder = ${timestamp}
    WHERE unique_id in (
      SELECT  unique_id  FROM ${o.schema}.${o.tbName}
      WHERE placeholder is NULL
      --ORDER BY "unique_id"
      LIMIT ${o.limit}
      FOR UPDATE
    );

    SELECT  url, params, query, unique_id  FROM ${o.schema}.${o.tbName}
    WHERE placeholder = ${timestamp};

    COMMIT;
  `;
  return sql;
};

// 执行成功后, 给任务解锁(分布式会用到)
const getSuccessSQL = (options) => {
  const o = check(options);
  const sql = `
    UPDATE ${o.schema}.${options.tbName}
    SET last_update = now(), "updatedAt" = now(), placeholder = 0
    WHERE unique_id = '${options.unique_id}'
  `;
  return sql;
};

const getFailSQL = (options) => {
  const o = check(options);
  let isable = true;
  if (o.isable === false) isable = false;
  return `
    UPDATE ${o.schema}.${o.tbName}
    SET lock = false, retry = retry + 1, error = '${o.error}', "updatedAt" = now(), isable = ${isable}
    WHERE unique_id = '${o.unique_id}'
  `;
};

const getCreateIndexSQL = (options) => {
  const o = check(options);
  return `
    CREATE INDEX IF NOT EXISTS ${`${o.tbName}_lock_idx`} on ${o.schema}.${o.tbName}("lock");
    CREATE INDEX IF NOT EXISTS ${`${o.tbName}_retry_idx`} on ${o.schema}.${o.tbName}("retry");
    CREATE INDEX IF NOT EXISTS ${`${o.tbName}_unique_id_idx`} on ${o.schema}.${o.tbName}("unique_id");
  `;
};

function getDropSQL(options) {
  const o = check(options);
  return `
    DROP TABLE IF EXISTS ${o.schema}.${o.tbName} CASCADE
  `;
}

const getCleanSQL = (options) => {
  const o = check(options);
  return `
    DELETE FROM ${o.schema}.${o.tbName}
  `;
};

const getUpsertSQL = (o, d) => {
  const { unique_id, url } = d;
  const query = JSON.stringify(d.query || {});
  const params = JSON.stringify(d.params || {});
  const index = d.index || 0;
  const createdAt = 'now()',
    updatedAt = 'now()',
    retry = '0',
    lock = 'false',
    isable = 'true';

  return `INSERT INTO ${o.schema}.${o.tbName}(  unique_id,    url,         params,          "createdAt",   retry,    lock,    isable, "query",  "updatedAt")
                                      VALUES ('${unique_id}', '${url}', '${params}'::json, ${createdAt}, ${retry}, ${lock}, ${isable},  '${query}'::json, ${updatedAt})
          ON CONFLICT (unique_id) DO UPDATE SET url = EXCLUDED.url, params = EXCLUDED.params, "updatedAt" = EXCLUDED."updatedAt";
          `;
};

const getBigUpsertSQL = (options, ds) => { // 通过transcation
  const o = check(options);
  return `
    BEGIN TRANSACTION;
     ${ds.map(d => getUpsertSQL(o, d)).join('')}
    COMMIT;
  `;
};

module.exports = {
  getCreateIndexSQL,
  getTaskCountSQL,
  getCleanSQL,
  getDropSQL,
  getStartSQL,
  getUrlSQL,
  getSuccessSQL,
  getFailSQL,
  getBigUpsertSQL,
  updateFinishSQL
};
