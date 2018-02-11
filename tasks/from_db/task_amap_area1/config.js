 const url = require('./url');
 const processor = require('./processor');
  //
 module.exports = { version: 2,
   name: 'task_amap_area',
   name_cn: '高德区域',
   time: 7,
   encode: 'utf8',
   queryType: 'get',
   parallN: 3,
   parseType: 'json',
   tables: [{ db_id: 'local_spider', table_name: 'areas', table_schema: 'public' }],
  //  models: ['area'],
   url,
   processor
 };

