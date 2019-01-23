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

module.exports = { printBars };
