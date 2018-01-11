# SPIDER MAN
爬虫框架


使用案例:
``` shell
 node index.js  -n house_lianjia_community_mobile_shanghai -d lianjia_ofo  --clean
```

设置所有的数据库: 
```
/core/db.json
```

参数:

| 简写 |全称 | 说明 | 默认 |
| -- | --- | ----- | -- |
| -n |--name|爬虫名|无|
| -u |--update|更新url|false|
| -c |--clean|删除过去url|false|
| -d |--db_id|目标修改的数据库id|local_spider|
| -ud |--url_db_id|存放url的数据库id|local_spider|