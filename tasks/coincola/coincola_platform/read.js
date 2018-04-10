// const redis = require('redis');

// const client = redis.createClient(6379, '127.0.0.1');
// const client1 = redis.createClient(6379, '127.0.0.1');

// function getRedisData() {
//     // 客户端连接redis成功后执行回调
//     client.on('ready', () => {
//         // 订阅消息
//         client.subscribe('btc-msg');
//         console.log('订阅成功。。。');
//     });

//     client.on('error', (error) => {
//         console.log(`Redis Error ${error}`);
//     });

//     // 监听订阅成功事件
//     client.on('subscribe', (channel, count) => {
//         console.log(`client subscribed to ${channel},${count}total subscriptions`);
//     });

//     // 收到消息后执行回调，message是redis发布的消息
//     client.on('message', (channel, message) => {
//         console.log(`我接收到信息了${message}`);
//         dealWithMsg(message);
//     });

//     // 监听取消订阅事件
//     client.on('unsubscribe', (channel, count) => {
//         console.log(`client unsubscribed from${channel}, ${count} total subscriptions`);
//     });
// }

// function dealWithMsg(message) {
//     // 按照message查询内容
//     client1.zscore('z', message, (err, reply) => {
//         console.log(`${message}的内容是：${reply}`);
//     });
// }

// function pub(key, score, msg) {
//     client.zadd(key, score, msg, () => {
//         const bufferBody = new Buffer(JSON.stringify(msg), 'utf8');
//         client.publish('virtual-currency', bufferBody);// client将member发布到btc-msg这个频道,go去处理
//     });
// }

// module.exports = {
//     pub,
//     client,
// };
