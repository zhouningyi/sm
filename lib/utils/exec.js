// 正则表达式
function cut(str, a, b, isAll = false) { // 从str里 切出ab之间的字符
  if (!str) return null;
  a = a || '', b = b || '';
  const re = new RegExp(`${a}([^\/]+)${b}`, isAll ? 'g' : undefined);
  const ma = str.match(re);
  // if(isAll) return ma || undefined;
  if (ma) return ma[1];
  return null;
}

function trim(str) {
  if (!str) return false;
  str = str.replace(/(^\s+)|(\s+$)/g, '');
  str = str.replace(/\n/g, '');
  str = str.replace(/\r/g, '');
  str = str.replace(/ /g, '');
  str = str.replace(/    /g, '');
  str = str.replace(/ /g, '');
  str = str.replace(/\t/g, '');

  return str;
}

function trimSpace(str) {
  if (!str) return false;
  str = str.replace(/(^\s+)|(\s+$)/g, '');
  str = str.replace(/\t/g, '');
  str = str.replace(/ /g, '');
  return str;
}

function getNumberFromString(str) {
  if (!str) return null;
  const re = /\d+/g;
  const ms = str.match(re);
  if (!ms) return null;
  return ms[0];
}

function extractDate(str) {
  if (!str) return;
  const pattern = /^([2-9]\d{3}((0[1-9]|1[012])(0[1-9]|1\d|2[0-8])|(0[13456789]|1[012])(29|30)|(0[13578]|1[02])31)|(([2-9]\d)(0[48]|[2468][048]|[13579][26])|(([2468][048]|[3579][26])00))0229)$/g;
  const reg = new RegExp(pattern);
  return str.match(reg);
}

module.exports = {
  cut,
  trim,
  trimSpace,
  getNumberFromString,
  extractDate,
};

