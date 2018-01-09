const cheerio = require('cheerio');

module.exports = exports = function $(source) {
  // return selector => cheerio.load(source)(selector);
  return cheerio.load(source);
};
