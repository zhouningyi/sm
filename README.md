# SPIDER MAN 爬虫框架

### 使用说明:
请将需要使用的数据库配置，写入```core/db.json```
``` shell
 git clone git@github.com:zhouningyi/sm.git
 cd ./sm/lib
 git clone git@github.com:zhouningyi/dblink.git
 cd ..
 cnpm i
 node index.js  -n digital_coin  --clean
```

shell参数:

| 简写 |全称 | 说明 | 默认 |
| -- | --- | ----- | -- |
| -n |--name|爬虫名|无|
| -u |--update|更新url|false|
| -c |--clean|删除过去url|false|
| -d |--db_id|目标修改的数据库id|local_spider|
| -ud |--url_db_id|存放url的数据库id|local_spider|


### 可执行的tasks可见
```shell
/tasks/coinmarket/
```

### 标准配置参考:
```shell
/utils/config.js
```

