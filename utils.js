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

module.exports = { getDayName, groupBySum };
