function getHeatClass(ratio){
  let cls = 'cell';
  if (ratio > 0 && ratio <= 0.33) cls += ' lvl1';
  else if (ratio > 0.33 && ratio <= 0.66) cls += ' lvl2';
  else if (ratio > 0.66) cls += ' lvl3';
  return cls;
}

if (typeof module !== 'undefined') {
  module.exports = { getHeatClass };
}
