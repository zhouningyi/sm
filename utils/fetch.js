const superagent = require('superagent');
require('superagent-charset')(superagent); // support charset
require('superagent-proxy')(superagent); // support proxy
const url = require('url');


const ABU_PROXY = {
  host: 'proxy.abuyun.com',
  port: '9010',
  user: 'HO7X190W690K18JP',
  pass: '6082F6982AAFD514',
};

Object.assign(ABU_PROXY, {
  url: `http://${ABU_PROXY.host}:${ABU_PROXY.port}`,
  headers: {
    'Proxy-Authorization': `Basic ${new Buffer(`${ABU_PROXY.user}:${ABU_PROXY.pass}`).toString('base64')}`,
    'Proxy-Switch-Ip': 'yes'
  }
});

function getHostFromUrl(rawUrl) {
  return url.parse(rawUrl).hostname;
}

module.exports = async function fetch(url, options = {}) {
  const {
    method = 'get',
    query = {},
    body = {},
    headers = {},
    proxy = false,
    charset,
    tryTimes = 3,
  } = options;

  let _tryTimes = tryTimes;

  const request = superagent[method.toLowerCase()];
  if (request === undefined) throw new Error(`Invalid Request Method: ${method.toLowerCase()}`);

  const asyncRequest = function () {
    return new Promise((resolve, reject) => {
      if (typeof proxy === 'object') {
        return request(url)
        // .proxy(proxy)
        .charset(charset)
        // .set({ host: getHostFromUrl(url) })
        // .proxy({
        //  host: ABU_PROXY.host,
        //  port: ABU_PROXY.port,
        //  protocol: 'http',
        //  auth: `${ABU_PROXY.user}:${ABU_PROXY.pass}`
        // })
        .timeout({
          response: 5000,
          deadline: 10000,
        })
        .end((err, res) => {
          if (err) {
            err.status = 503;
            return reject(err);
          }

          return resolve(res);
        });
      }

      if (proxy === true) {
        return request(url)
        // .proxy(ABU_PROXY.url)
        .charset(charset)
        .set(Object.assign({}, headers, ABU_PROXY.headers))
        // .set(ABU_PROXY.headers)
        // .set({ host: getHostFromUrl(url) })
        // .proxy({
        //  host: ABU_PROXY.host,
        //  port: ABU_PROXY.port,
        //  protocol: 'http',
        //  auth: `${ABU_PROXY.user}:${ABU_PROXY.pass}`
        // })
        .timeout({
          response: 5000,
          deadline: 10000,
        })
        .end((err, res) => {
          if (err) {
            err.status = 503;
            return reject(err);
          }

          return resolve(res);
        });
      }

      return request(url)
    // return superagent.get(url)
      .charset(charset)
      .set(headers)
      .set({ Connection: 'close' })
      .query(query)
      .send(body)
      .timeout({
        response: 5000,
        deadline: 10000,
      })
      .end((err, res) => {
        if (err) {
          err.status = res.status;
          return reject(err);
        }
        return resolve(res);
      });
    });
  };

  try {
    return await asyncRequest();
  } catch (err) {
    console.log(`重试: ${4 - _tryTimes}`);
    if (_tryTimes >= 1 && err.status === 503) {
      _tryTimes -= 1;
      return await asyncRequest();
    }

    throw err;
  }
};
