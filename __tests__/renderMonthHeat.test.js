const { getHeatClass } = require('../heat');

describe('getHeatClass', () => {
  test('0 -> cell', () => {
    expect(getHeatClass(0)).toBe('cell');
  });

  test('0.2 -> cell lvl1', () => {
    expect(getHeatClass(0.2)).toBe('cell lvl1');
  });

  test('0.5 -> cell lvl2', () => {
    expect(getHeatClass(0.5)).toBe('cell lvl2');
  });

  test('0.8 -> cell lvl3', () => {
    expect(getHeatClass(0.8)).toBe('cell lvl3');
  });
});
