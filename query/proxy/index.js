/**
 * 寻找合适的代理池
 */
const Abu = require('./abu');
const Shadow = require('./shadow');

const getProxy = (type) => {
  if (type === 'abu') return new Abu();
  if (type === 'shadow') return new Shadow();
};

module.exports = getProxy;
