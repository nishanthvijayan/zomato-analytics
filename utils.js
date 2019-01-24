const DAY_MAP = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const getDayName = date => DAY_MAP[new Date(date).getDay()];

const groupBySum = (arr, keySelector, valueSelector) => arr.reduce((acc, item) => {
  const key = keySelector(item);
  const value = valueSelector(item);

  if (acc[key]) {
    acc[key] += value;
  } else {
    acc[key] = value;
  }

  return acc;
}, {});

const sortByValueDesc = (a, b) => b.value - a.value;

const printBars = (data, { top = 10, width = 100, sortFn = sortByValueDesc } = {}) => {
  const block = '\u2580';
  const labelValueArr = Object.entries(data)
    .map(([key, value]) => ({ label: key, value }));

  const maxValue = Math.max(...labelValueArr.map(it => it.value));

  labelValueArr
    .sort(sortFn)
    .slice(0, top)
    .forEach(({ label, value }) => {
      const truncatedValue = Math.trunc(value);

      console.log(
        label,
        ' '.repeat(25 - label.length),
        `₹${truncatedValue}`,
        ' '.repeat(8 - truncatedValue.toString().length),
        block.repeat(width * truncatedValue / maxValue),
      );
    });
};

module.exports = { getDayName, groupBySum, printBars };