const UtilsData = require('./data');
const _ = require('lodash');

// 单词 => 复数形式, 主要改数据库的表名, 抄moogoose的做法
const uncountables = [
  'advice',
  'energy',
  'excretion',
  'digestion',
  'cooperation',
  'health',
  'justice',
  'labour',
  'machinery',
  'equipment',
  'information',
  'pollution',
  'sewage',
  'paper',
  'money',
  'species',
  'series',
  'rain',
  'rice',
  'fish',
  'sheep',
  'moose',
  'deer',
  'news',
  'expertise',
  'status',
  'media'
];

const rules = [
  [/(m)an$/gi, '$1en'],
  [/(pe)rson$/gi, '$1ople'],
  [/(child)$/gi, '$1ren'],
  [/^(ox)$/gi, '$1en'],
  [/(ax|test)is$/gi, '$1es'],
  [/(octop|vir)us$/gi, '$1i'],
  [/(alias|status)$/gi, '$1es'],
  [/(bu)s$/gi, '$1ses'],
  [/(buffal|tomat|potat)o$/gi, '$1oes'],
  [/([ti])um$/gi, '$1a'],
  [/sis$/gi, 'ses'],
  [/(?:([^f])fe|([lr])f)$/gi, '$1$2ves'],
  [/(hive)$/gi, '$1s'],
  [/([^aeiouy]|qu)y$/gi, '$1ies'],
  [/(x|ch|ss|sh)$/gi, '$1es'],
  [/(matr|vert|ind)ix|ex$/gi, '$1ices'],
  [/([m|l])ouse$/gi, '$1ice'],
  [/(kn|w|l)ife$/gi, '$1ives'],
  [/(quiz)$/gi, '$1zes'],
  [/s$/gi, 's'],
  [/([^a-z])$/, '$1'],
  [/$/gi, 's']
];

const pluralize = (str) => {
  let found;
  if (!~uncountables.indexOf(str.toLowerCase())) {
    found = rules.filter((rule) => {
      return str.match(rule[0]);
    });
    if (found[0]) {
      return str.replace(found[0][0], found[0][1]);
    }
  }
  return str;
};

const upsertPg = (model, ds) => {
  ds = UtilsData.cleanObjectNull(ds);
  model
  .upsert(ds)
  .then(() => {})
  .catch(e => console.log(e));
};

const typeFormat = (v) => {
  const tv = typeof (v);
  if (tv === 'string') {
    v = `'${v}'`;
  } else if (tv === 'object') {
    v = `${v}::json`;
  }
  return v;
};

const getUpsertSQL = (o, d) => {
  const { unique_id, url } = d;
  const keys = _.keys(d);
  const values = _.values(d).map(typeFormat);
  const createdAt = 'now()',
    updatedAt = 'now()';
  const vUpdate = v => `"${v}"= EXCLUDED."${v}"`;
  const updates = keys.filter(k => k !== o.unique).map(vUpdate).join(',');

  return `INSERT INTO ${o.schema || 'public'}.${o.table || o.tbName}(  ${keys.join(',')} , "createdAt",  "updatedAt") 
                                      VALUES (  ${values.join(',')}, ${createdAt}, ${updatedAt})
          ON CONFLICT (${o.unique}) DO UPDATE SET ${updates}, "updatedAt" = EXCLUDED."updatedAt";
          `;
};

const getBigUpsertSQL = (o, ds) => { // 通过transcation
  return `
    BEGIN TRANSACTION;
     ${ds.map(d => getUpsertSQL(o, d)).join('')}
    COMMIT;
  `;
};

module.exports = {
  pluralize, upsertPg, getBigUpsertSQL
};
