

function formatLine(line) {
  let { name, formatted_address, aoi_name } = line;
  // real_parent_name, real_address, real_no,
  // console.log(name, formatted_address, aoi_name);
  let real_no;
  function testChar(name, char) {
    if (name.indexOf(char) !== -1) {
      name = name.split(char)[1];
      real_no = name;
    }
  }
  if (name) {
    if (name.endsWith('号楼')) name = name.replace(/号楼/g, '号');
    if (name.indexOf('^') !== -1) {
      name = name.split('^')[1];
      real_no = name;
    } else if (name.length < 5) {
      real_no = name;
    }
    const chars = ['坊', '园', '郡', '弄', '居', '路', '轩', '家园', '公寓', '村', '花苑', '园区', '花园', '广场', '苑', '小区'];
    for (const i in chars) {
      const char = chars[i];
      testChar(name, char);
    }
    if (!real_no) {
      console.log(name, 'real_no except...');
      real_no = name;
    }
    if (real_no) line.real_no = real_no;
    //
    let real_address;
    if (formatted_address) {
      if (formatted_address.indexOf('区') !== -1) {
        formatted_address = formatted_address.split('区');
        formatted_address.shift();
        formatted_address = formatted_address.join('区');
      }
      real_address = formatted_address;
      if (real_address) real_address = real_address.split('(')[0];
    }
    if (real_address) line.real_address = real_address;
    //
    if (aoi_name) line.real_parent_name = aoi_name.split('(')[0];
  }
  return line;
}

module.exports = { formatLine }
;
