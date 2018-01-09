

const cleanObjectNull = (o) => {
  let v;
  for (const k in o) {
    v = o[k];
    if (v === null || v === undefined || v === '') delete o[k];
    if (isNaN(v) && typeof (v) === 'number') delete o[k];
  }
  return o;
};

module.exports = {
  cleanObjectNull
};
