
const request = require('request');

async function getJSON(url, query) {
  return new Promise((resolve, reject) => {
    request.get({
      url,
    }, (e, d) => {
      if (e) return reject(e);
      resolve(d);
    });
  });
}
module.exports = {
  getJSON
};
